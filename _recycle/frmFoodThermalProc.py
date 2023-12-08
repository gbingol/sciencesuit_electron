import wx

import numpy as np





	if rng != None and rng.ncols() >= 2:
		N = 1 if rng.ncols() == 2 else rng.ncols() - 1 #ncols for temperature
		rng1 = rng.subrange(0, 0, -1, 1)
		rng2= rng.subrange(0, 1, -1, N)
		self.m_txt_t.SetValue(str(rng1))
		self.m_txt_T.SetValue(str(rng2))

	self.m_stRefT = wx.StaticText( self, wx.ID_ANY, u"Ref Temperature:")
	self.m_stRefT.Wrap( -1 )
	self.m_txtRefT = NumTextCtrl( self, val="121")


	self.m_pnlOutput = _se.pnlOutputOptions( self)

	sdbSizer = wx.StdDialogButtonSizer()
	self.m_ComputeBtn = wx.Button( self, wx.ID_OK, label = "Compute" )
	sdbSizer.AddButton( self.m_ComputeBtn )
	self.m_CloseBtn = wx.Button( self, wx.ID_CANCEL, label = "Close" )
	sdbSizer.AddButton( self.m_CloseBtn )
	sdbSizer.Realize()

	mainSizer = wx.BoxSizer( wx.VERTICAL )
	mainSizer.Add( fgSizer, 1, wx.EXPAND, 5 )
	mainSizer.Add( self.m_pnlOutput, 0, wx.EXPAND |wx.ALL, 5 )
	mainSizer.Add( sdbSizer, 0, wx.ALL|wx.ALIGN_CENTER_HORIZONTAL, 5 )

	self.SetSizerAndFit( mainSizer )
	self.Layout()
	self.Centre( wx.BOTH )

	self.m_CloseBtn.Bind( wx.EVT_BUTTON, self.__OnCancelBtn )
	self.m_ComputeBtn.Bind( wx.EVT_BUTTON, self.__OnBtnCompute )




def Compute(self, t:np.ndarray, T:np.ndarray, Dval_time:float, Dval_T:float, zvalue:float, Ref_T:float):
	assert len(t) == len(T), "Length of time and temperature data must be equal."
	
	DValue = Dval_time*10.0**((Dval_T-T)/zvalue) #array
	LethalRate = 10.0**((T-Ref_T)/zvalue) #array
	
	"""
	Previously scisuit.core.cumtrapz_d function was used, however it is discontinued.
	FValue = scr.cumtrapz_d(x=t.tolist(), y=LethalRate.tolist()) # array

	
	Below is a list comprehension using np.trapz function which yields trapezoidal values 
	at each node, therefore acts as cumulative. 
	
	Although this is fairly slow (can be optimized to use previous values), for this 
	application it is fast enough. 
	"""
	FValue = [np.trapz(x=t[0:i], y=LethalRate[0:i]) for i in range(1, len(t)+1)]
	
	dt = np.diff(t)
	avg_T = np.asfarray(FindAvg(T))
	DVal_avg = Dval_time*10.0**((Dval_T-avg_T)/zvalue)
	LogRed = dt/DVal_avg
	
	TotalLogRed = np.cumsum(LogRed)
	TotalLogRed = np.insert(TotalLogRed, 0, 0.0) # at time=0 TotalLogRed(1)=0

	return [LethalRate, DValue, TotalLogRed, FValue]
		


	
	def __PrintVals(self, WS, Row, Col, time:np.ndarray, Temperatures:list, Results:list):
		Headers=["Time ", "Temperature", "Lethality Rate", "D Value","Total Log Reduction", "F-Value"]

		for i in range(len(Temperatures)):
			WS[Row, Col] = {'value':"Col #" + str(i+1) , 'weight':"bold"}
			Row += 1
	
			for k in range(len(Headers)):
				WS[Row, Col + k] = {'value': Headers[k], 'style':"italic"}


			for j in range(len(time)):
				Row += 1
				CurResult = Results[i]

				LethalRate = CurResult[0][j]
				DValue = CurResult[1][j]
				TotalLogRed = CurResult[2][j]
				FValue = CurResult[3][j]

				WS[Row, Col] = str(time[j])
				WS[Row, Col+1] = str(Temperatures[i][j])
				WS[Row, Col+2] = str(round(LethalRate, 3))
				WS[Row, Col+3] = str(round(DValue, 3))
				WS[Row, Col+4] = str(round(TotalLogRed, 3))
				WS[Row, Col+5] = str(round(FValue, 2))
			
			Row += 2 #result of next computation
				


	def __OnBtnCompute( self, event ):
		try:
			assert self.m_txt_Z.GetValue() != "" , "z-value cannot be blank"
			assert self.m_txt_D_T.GetValue() != "", "D(Temperature) cannot be blank"
			assert self.m_txt_D_t.GetValue() != "", "D(time) cannot be blank"
		
			zvalue = float(self.m_txt_Z.GetValue())
			Dvalue_Temp = float(self.m_txt_D_T.GetValue())
			Dvalue_Time = float(self.m_txt_D_t.GetValue())
			RefTemp = float(self.m_txtRefT.GetValue())
		
			assert Dvalue_Time>0 and  zvalue>0, "D- and z-values >0 expected"

			time = np.asfarray(_se.Range(self.m_txt_t.GetValue()).tolist())
			range_T = _se.Range(self.m_txt_T.GetValue())
	

			Results = []
			Temperatures = []

			for i in range(range_T.ncols()):				
				temperature = np.asfarray(range_T.col(i)) 
				result = self.Compute(time, temperature, Dvalue_Time, Dvalue_Temp, zvalue, RefTemp) 			
				Results.append(result)
				Temperatures.append(temperature)
			
			WS, Row, Col = self.m_pnlOutput.Get()
			assert WS != None, "Output Options: The selected range is not in correct format or valid."

			self.__PrintVals(WS, Row, Col, time, Temperatures, Results )
			
		except Exception as e:
			wx.MessageBox(str(e), "Error")



if __name__ == "__main__":
	x=np.array([1,2,3,4,5])
	print(np.diff(x))

