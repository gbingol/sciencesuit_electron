#include "psychrometry.h"

#include <assert.h>
#include <sstream>
#include <array>


#define ASSIGNSTATE(NAME) m_##NAME=NAME;st_##NAME=true


double linearinterp(
	double x1, 
	double y1, 
	double x2, 
	double y2, 
	double val)
{
	/* Given 2 data points (x1,y1) and (x2,y2) we are looking for the y-value of the point x=val */
	if (x1 == x2)
		return y1;

	double m, n;

	m = (y2 - y1) / (x2 - x1);
	n = y2 - m * x2;

	return m * val + n;
}


std::string Psychrometry::to_str(char sep)
{
	std::stringstream ss;

	auto Print = [&](std::string property, double value, std::string unit)
	{
		char sep2 = sep == '\0' ? ' ' : sep;
		ss << property << sep << value << sep2 << unit << "\n";
	};

	Print("P=", m_P / 1000, "kPa");
	Print("Tdb=", m_Tdb, "C");
	Print("Twb=", m_Twb, "C");
	Print("Tdp=", m_Tdp, "C");
	Print("H=", m_H, "kJ/kg da");
	Print("RH=", m_RH, "%");
	Print("W=", m_W, "kg/kg da");
	Print("V=", m_V, "m3/kg da");
	
	ss << "Misc properties:" << "\n";

	Print("Pw=", m_Pw / 1000, "kPa");	
	if (m_Pws < m_P)
	{
		Print("Pws=", m_Pws / 1000, "kPa (saturation)");
		Print("Ws=", varWs, "kg/kg da (saturation)");
	}

	return ss.str();
}



void Psychrometry::Compute(std::vector<std::string> keys, std::vector<double> values)
{
	bool chkT = false, chkTwb = false, chkTdp = false, chkP = false, chkRH = false, chkW = false, chkH = false, chkV = false;

	double locT = 0, locTwb = 0, locTdp = 0;
	double locP = 0;
	double locRH = 0;
	double locW = 0;
	double locH = 0;
	double locV = 0;


	int index = 0;
	for (const auto& key : keys)
	{
		if (key == "tdb") {
			chkT = true;
			locT = values[index];
		}

		else if (key == "twb") {
			chkTwb = true;
			locTwb = values[index];
		}

		else if (key == "tdp") {
			chkTdp = true;
			locTdp = values[index];
		}

		else if (key == "p") {
			chkP = true;
			locP = values[index];
		}

		else if (key == "rh") {
			chkRH = true;
			locRH = values[index];
		}

		else if (key == "h") {
			chkH = true;
			locH = values[index];
		}

		else if (key == "v") {
			chkV = true;
			locV = values[index];
		}

		else if (key == "w") {
			chkW = true;
			locW = values[index];
		}

		index++;
	}


	//Sanity check on inputs
	if (chkP && (locP > 1553.8 * 1000 || locP < 1000))
		throw std::runtime_error("P [1, 1553.8] kPa expected.");

	if (chkT && (locT > 200 || locTwb < -60))
		throw std::runtime_error("Tdb [-60, 200]�C expected.");

	if (chkTwb && (locTwb > 200 || locTwb < -60))
		throw std::runtime_error("Twb (-60, 200)�C expected.");

	if (chkTdp && (locTdp > 200 || locTdp < -60.0))
		throw std::runtime_error("Tdp (-60, 200)�C expected.");

	if (chkRH && (locRH > 100 || locRH <= 0))
		throw std::runtime_error("Relative humidity in (0,100] expected.");

	if (chkW && locW <= 0)
		throw std::runtime_error("Absolute humidity > 0.0 kg/kg da expected.");

	if (chkT && chkTwb && locTwb > locT)
		throw std::runtime_error("Twb <= Tdb expected.");

	if (chkH && locH <= 0)
		throw std::runtime_error("Enthalpy > 0.0 kJ/kg da expected.");

	if (chkV && locV <= 0)
		throw std::runtime_error("Specific volume > 0.0 m3/kg da expected.");


	if (chkP && chkT && chkTwb) 
		TTwbP(locT, locTwb, locP); 

	else if (chkT && chkTdp && chkP) 
		TTdpP(locT, locTdp, locP); //Comb #2

	else if (chkT && chkP && chkW) 
		TPW(locT, locP, locW); //Comb #3

	else if (chkT && chkW && chkRH) 
		TWRH(locT, locW, locRH); //Comb #4

	else if (chkT && chkRH && chkH) 
		TRHH(locT, locRH, locH); //Comb #5

	else if (chkT && chkTwb && chkP) 
		TTwbP(locT, locTwb, locP);//Comb #6

	else if (chkT && chkTdp && chkW) 
		TTdpW(locT, locTdp, locW);//Comb #7

	else if (chkT && chkP && chkRH) 
		TPRH(locT, locP, locRH);//Comb #8

	else if (chkT && chkTwb && chkW) 
		TTwbW(locT, locTwb, locW);//Comb #10

	else if (chkT && chkP && chkH) 
		TPH(locT, locP, locH);//Comb #12

	else if (chkT && chkTwb && chkRH) 
		TTwbRH(locT, locTwb, locRH);//Comb #13

	else if (chkT && chkTdp && chkH) 
		TTdpH(locT, locTdp, locH);//Comb #14

	else if (chkT && chkTwb && chkH) 
		TTwbH(locT, locTwb, locH);//Comb #15


	//Twb is always known
	else if (chkTwb && chkP && chkW) 
		TwbPW(locTwb, locP, locW);//Comb #16

	else if (chkTwb && chkTdp && chkP) 
		TwbTdpP(locTwb, locTdp, locP);//Comb #17

	else if (chkTwb && chkW && chkRH) 
		TwbWRH(locTwb, locW, locRH);//Comb #18

	else if (chkTwb && chkRH && chkH) 
		TwbRHH(locTwb, locRH, locH);//Comb #19

	else if (chkTwb && chkTdp && chkW) 
		TwbTdpW(locTwb, locTdp, locW);//Comb #20

	else if (chkTwb && chkP && chkRH) 
		TwbPRH(locTwb, locP, locRH);//Comb #21

	else if (chkTwb && chkW && chkH) 
		TwbWH(locTwb, locW, locH);//Comb #22

	else if (chkTwb && chkTdp && chkRH) 
		TwbTdpRH(locTwb, locTdp, locRH);//Comb #23

	else if (chkTwb && chkP && chkH) 
		TwbPH(locTwb, locP, locH);//Comb #24

	else if (chkTwb && chkTdp && chkH) 
		TwbTdpH(locTwb, locTdp, locH);//Comb #25


		//Tdp is always known
	else if (chkTdp && chkW && chkRH) 
		TdpWRH(locTdp, locW, locRH);//Comb #27

	else if (chkTdp && chkRH && chkH) 
		TdpRHH(locTdp, locRH, locH);//Comb #28

	else if (chkTdp && chkP && chkRH) 
		TdpPRH(locTdp, locP, locRH);//Comb #29

	else if (chkTdp && chkW && chkH) 
		TdpWH(locTdp, locW, locH);//Comb #30

	else if (chkTdp && chkP && chkH) 
		TdpPH(locTdp, locP, locH);//Comb #31


	//P is always known
	else if (chkP && chkW && chkRH) 
		PWRH(locP, locW, locRH);//Comb #32

	else if (chkP && chkRH && chkH) 
		PRHH(locP, locRH, locH);//Comb #33

	else if (chkP && chkW && chkH) 
		PWH(locP, locW, locH);//Comb #34

	else if (chkW && chkRH && chkH) 
		WRHH(locW, locRH, locH);//Comb #35


	//V is always known
	else if (chkT && chkH && chkV) 
		VTH(locV, locT, locH);

	else if (chkT && chkRH && chkV) 
		VTRH(locV, locT, locRH);

	else if (chkT && chkP && chkV) 
		VTP(locV, locT, locP);

	else if (chkT && chkW && chkV) 
		VTW(locV, locT, locW);

	else if (chkT && chkTwb && chkV) 
		VTTwb(locV, locT, locTwb);

	else if (chkT && chkTdp && chkV) 
		VTTdp(locV, locT, locTdp);

	else if (chkTwb && chkTdp && chkV)
		VTwbTdp(locV, locTwb, locTdp);

	else if (chkTwb && chkH && chkV) 
		VTwbH(locV, locTwb, locH);

	else if (chkTwb && chkP && chkV) 
		VTwbP(locV, locTwb, locP);

	else if (chkTwb && chkW && chkV) 
		VTwbW(locV, locTwb, locW);

	else if (chkTdp && chkH && chkV) 
		VTdpH(locV, locTdp, locH);

	else if (chkTdp && chkP && chkV) 
		VTdpP(locV, locTdp, locP);

	else if (chkTdp && chkW && chkV) 
		VTdpW(locV, locTdp, locW);

	else if (chkTdp && chkRH && chkV) 
		VTdpRH(locV, locTdp, locRH);

	else if (chkP && chkW && chkV) 
		VPW(locV, locP, locW);

	else if (chkP && chkH && chkV) 
		VPH(locV, locP, locH);

	else if (chkP && chkRH && chkV) 
		VPRH(locV, locP, locRH);

	else if (chkW && chkRH && chkV) 
		VWRH(locV, locW, locRH);

	else if (chkRH && chkH && chkV) 
		VRHH(locV, locRH, locH);

	else
		throw "Requested combination cannot be computed.";

}


//returns Celcius, Pressure is Pascal
double Psychrometry::FindTemperature(double Pressure) 
{
	assert(Pressure > 0);
	/*
		Initially equations were used. However, it was found that
		when pressure was around 51 kPa, the equations returned -84�C,
		which does not make sense at all.

		Therefore, the saturated steam tables are used and there
		should not be any performance downgrade by doing a few extra
		iterations (a max of 28).
	*/

	double P = Pressure / 1000.0; //Pa to kPa
	

	//Values are taken from table for saturated pressure and temperature of water vapor
	std::array<double, 27> T = { -60.0, -50.0, -40.0, -30.0, -20.0, -10.0, 0.0, 10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 
		100.0, 110.0, 120.0, 130.0, 140.0, 150.0, 160.0, 170.0, 180.0, 190.0, 200.0 }; //Celcius

	std::array<double, 27> Pws = { 0.00108, 0.00394, 0.01285, 0.03802, 0.10326, 0.25990, 0.61115, 1.2276,
		2.339, 4.246, 7.384, 12.349, 19.94, 31.19, 47.39, 70.14, 101.35, 143.27, 198.53, 270.1, 361.3, 475.8,
		617.8, 791.7, 1002.1, 1254.4, 1553.8 }; //kPa


	if (P > 0 && P < Pws[0])
		return T[0];

	auto Index = binary_search_index(Pws.begin(), Pws.end(), P);
	size_t i = Index.value();

	return linearinterp(Pws[i - 1], T[i - 1], Pws[i], T[i], P);
}


//T, temperature is in Celcius, function returns in Pascal
double Psychrometry::FindPressure(double T) 
{
	double alfa = 0, A = 0, B = 0, c = 0, d = 0, Tk = 0;

	Tk = T + 273.15;

	assert(Tk > 0);

	if (is_inrange(Tk, 213.15, 273.15))
	{
		A = -0.7297593707 * pow(10, -5);
		B = 0.5397420727 * pow(10, -2);
		c = 0.206988062 * pow(10, 2);
		d = -0.6042275128 * pow(10, 4);
	}

	else if (is_inrange(Tk, 273.15, 322.15))
	{
		A = 0.1255001965 * pow(10, -4);
		B = -0.1923595289 * pow(10, -1);
		c = 100 * 0.2705101899;
		d = -0.6344011577 * pow(10, 4);
	}

	else if (is_inrange(Tk, 322.15, 373.15))
	{
		A = 0.1246732157 * pow(10, -4);
		B = -0.1915465806 * 0.1;
		c = 100 * 0.2702388315;
		d = -0.6340941639 * pow(10, 4);
	}

	else if (is_inrange(Tk, 373.15, 423.15))
	{
		A = 0.1204507646 * pow(10, -4);
		B = -0.1866650553 * 0.1;
		c = 0.2683626903 * 100;
		d = -0.6316972063 * pow(10, 4);
	}

	else if (is_inrange(Tk, 423.15, 473.15))
	{
		A = 0.1069730183 * pow(10, -4);
		B = -0.1 * 0.1698965754;
		c = 100 * 0.2614073298;
		d = -0.622078123 * pow(10, 4);
	}

	alfa = A * pow(Tk, 2) + B * Tk + c + d * pow(Tk, -1);

	return 1000 * exp(alfa);
}


double Psychrometry::Cp_DryAir(double T)
{
	//https://ninova.itu.edu.tr/en/courses/faculty-of-aeronautics-and-astronautics/965/uck-421/ekkaynaklar?g96162

	double TK = T + 273.15;

	assert(TK > 0);
	
	double Cp =
		1.9327E-10 * std::pow(TK, 4.0) - 
		7.9999E-7 * std::pow(TK, 3.0) +
		0.0011407 * std::pow(TK, 2.0) -
		0.4489 * TK +
		1057.5;

	return Cp / 1000.0;
}


void Psychrometry::ResetState()
{
	st_P = false; st_Pw = false; st_Pws = false; st_Pws_wb = false;
	st_Tdb = false; st_Tdp = false; st_Twb = false;
	st_W = false; st_Ws = false; st_Ws_wb = false;
	st_H = false; st_RH = false; st_V = false;
}


double Psychrometry::Compute_W(double P, double Pw)
{
	assert(P > 0);
	assert(Pw >= 0);

	if (Pw >= P)
		throw std::runtime_error("Partial pressure of vapor is higher than total pressure");

	return 0.62198 * Pw / (P - Pw);
}


double Psychrometry::Compute_W_fromH(double H, double T)
{
	return (H - T) / (2501 + 1.805 * T);
}


double Psychrometry::Compute_W(double Twb, double Ws_wb, double Tdb)
{
	double a = (2501 - 2.381 * Twb) * Ws_wb - (Tdb - Twb);
	double b = 2501 + 1.805 * Tdb - 4.186 * Twb;

	assert(b > 0);

	return a / b;
}


double Psychrometry::Compute_Twb(double Ws_wb, double W, double Tdb)
{
	double a = 2501 * (Ws_wb - W) - Tdb * (1 + 1.805 * W);
	double b = 2.381 * Ws_wb - 4.186 * W - 1;
	
	assert(std::abs(b) > 0);

	return a / b;
}


double Psychrometry::Compute_Twb_LowW(double Ws_wb, double Tdb)
{
	return (2501 * Ws_wb - Tdb) / (2.381 * Ws_wb - 1.0);
}


double Psychrometry::Compute_Tdb(double Ws_wb, double W, double Twb)
{
	assert(W > 0);
	assert(Ws_wb > 0);

	double a = (2501 - 2.381 * Twb) * Ws_wb - (2501 - 4.186 * Twb) * W + Twb;
	double b = 1 + 1.805 * W;

	return a / b;
}


double Psychrometry::Compute_V(double Tdb, double W, double P)
{
	assert(P > 0);

	return 287.055 * (Tdb + 273.15) * (1 + 1.6078 * W) / P;
}


double Psychrometry::Twb1521(double varP, double varW, double varT)
{
	//At high relative humidities, Twb almost equals to Tdb
	if (m_RH > 99.8)
		return varT * m_RH / 100;

	constexpr int MAXITERS = 1000;
	constexpr double TOL = 0.00001;

	
	double XX = varT; //max value of Twb
	double YY = -60; //min value of temperature
	double Twb = XX;

	double diff_W = varW;

	int NIters = 0;
	do
	{
		Twb = (XX + YY) / 2;
		
		double Pws_wb = FindPressure(Twb);
		double Ws_wb = Compute_W(varP, Pws_wb);
		double _W = Compute_W(Twb, Ws_wb, varT);

		diff_W = varW - _W;
			
		(diff_W < 0) ? XX = Twb : YY = Twb;
		
		if (NIters++ > MAXITERS)
			throw std::runtime_error("Max number of iterations exceeded.");

	} while (!(std::abs(diff_W) < TOL));

	return Twb;
}



void Psychrometry::TTwbP(double Tdb, double Twb, double P)
{
	//Combination #1
	//Input values: Tdb as Celcius, Twb as Celcius and P as Pascal

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(P);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Ws_wb)
	{
		m_Ws_wb = Compute_W(m_P, m_Pws_wb);
		st_Ws_wb = true;
	}

	if (!st_W)
	{
		m_W = Compute_W(m_Twb, m_Ws_wb, m_Tdb);
		st_W = true;
	}

	if (!st_Ws)
	{
		try {
			varWs = Compute_W(m_P, m_Pws);
		}
		catch (std::runtime_error& ) {
			varWs = 0.0;
		}
		st_Ws = true;
	}

	if (!st_Pw)
	{
		m_Pw = (m_P * m_W) / (m_W + 0.62198);
		st_Pw = true;
	}

	if (!st_Tdp)
	{
		m_Tdp = FindTemperature(m_Pw);
		st_Tdp = true;
	}

	if (!st_H)
	{
		m_H = m_Tdb + m_W * (2501 + 1.805 * m_Tdb);
		st_H = true;
	}

	if (!st_RH)
	{
		m_RH = m_Pw / m_Pws * 100;
		st_RH = true;
	}

	if (!st_V)
	{
		m_V = Compute_V(m_Tdb, m_W, m_P);
		st_V = true;
	}

}




void Psychrometry::TTwbTdp(double Tdb, double Twb, double Tdp)
{
	//Combination #2
	//Input values: T as Celcius, Twb as Celcius and Td as Celcius

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(Tdp);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}


	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}


	if (!st_P)
	{
		double A = (2501 + 1.805 * m_Tdb - 4.186 * m_Twb) * 0.62198 * m_Pw;
		double B = (2.381 * m_Twb - 2501) * 0.62198 * m_Pws_wb;
		double c = m_Twb - m_Tdb;
		double d = -(c * m_Pws_wb + c * m_Pw + B + A);
		double e = c * m_Pw * m_Pws_wb + B * m_Pw + A * m_Pws_wb;

		double Delta = d * d - 4 * c * e;

		m_P = (-d - pow(Delta, 0.5)) / (2 * c);
		st_P = true;
	}

	TTwbP(m_Tdb, m_Twb, m_P); //Comb 1
}



void Psychrometry::TTdpP(double Tdb, double Tdp, double P)
{
	//Combination #3
	//Input values: T as Celcius, Tdp as Celcius and P as Pascal

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(P);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_W)
	{
		m_W = Compute_W(m_P, m_Pw);
		st_W = true;
	}

	if (!st_Twb)
	{
		m_Twb = Twb1521(m_P, m_W, m_Tdb);
		st_Twb = true;
	}


	TTwbP(m_Tdb, m_Twb, m_P); //Comb 1
}



void Psychrometry::TPW(double Tdb, double P, double W)
{
	//Combination #4
	//Input values: T as Celcius P as Pascal and W as kg / kg dry air

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(P);
	ASSIGNSTATE(W);
	//
	if (!st_Twb)
	{
		m_Twb = Twb1521(m_P, m_W, m_Tdb);
		st_Twb = true;
	}

	TTwbP(m_Tdb, m_Twb, m_P); //Comb 1
}



void Psychrometry::TWRH(double Tdb, double W, double RH)
{
	//Combination #5
	//Input values: T as Celcius, W as kg / kg dry air and RH as is from [0,100]

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(W);
	ASSIGNSTATE(RH);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pw)
	{
		m_Pw = (m_RH / 100) * m_Pws;
		st_Pw = true;
	}

	if (!st_P)
	{
		m_P = 0.62198 * (m_Pw / m_W) + m_Pw;
		st_P = true;
	}

	TPW(m_Tdb, m_P, m_W); //Comb 4
}



void Psychrometry::TRHH(double Tdb, double RH, double H)
{
	//Combination #6
	//Input values: T as Celcius, W as kg / kg dry air and RH as is from 0-100

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(RH);
	ASSIGNSTATE(H);

	if (!st_W)
	{
		m_W = (m_H - m_Tdb) / (2501 + 1.805 * m_Tdb);
		st_W = true;
	}

	TWRH(m_Tdb, m_W, m_RH); //combination #5
}



void Psychrometry::TTdpW(double Tdb, double Tdp, double W)
{
	//Combination #7
	//Input values: T and Tdp as Celcius W kg/ kg dry air

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(W);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_RH)
	{
		m_RH = m_Pw / m_Pws * 100;
		st_RH = true;
	}

	TWRH(m_Tdb, m_W, m_RH); //combination #5
}



//Input values: Tdb as Celcius, P as Pascal and RH %
void Psychrometry::TPRH(double Tdb, double P, double RH)
{
	//Combination #8

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(P);
	ASSIGNSTATE(RH);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pw)
	{
		m_Pw = (m_RH / 100) * m_Pws;
		st_Pw = true;
	}

	if (std::abs(m_P - m_Pw) < 1E-3)
		throw std::runtime_error("At given P, Pw is almost equal P");


	if (!st_W)
	{
		m_W = Compute_W(m_P, m_Pw);
		st_W = true;
	}

	TPW(m_Tdb, m_P, m_W); //combination #4
}



void Psychrometry::TTwbW(double Tdb, double Twb, double W)
{
	//Combination #9
	//Input values: T and Twb as Celcius, W as kg/ kg dry air

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(W);


	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Ws_wb)
	{
		double A = (2501 + 1.805 * m_Tdb - 2.381 * m_Twb) * m_W;
		double B = m_Tdb - m_Twb;
		double C = 2501 - 2.381 * m_Twb;

		assert(std::abs(C) > 0);

		m_Ws_wb = (A + B) / C;
		st_Ws_wb = true;
	}

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_P)
	{
		m_P = 0.62198 * (m_Pws_wb / m_Ws_wb) + m_Pws_wb;
		st_P = true;
	}

	TTwbP(m_Tdb, m_Twb, m_P); //combination #1
}



void Psychrometry::TPH(double Tdb, double P, double H)
{
	//Combination #10
	//Input values: T and Twb as Celcius, W as kg/ kg dry air

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(P);
	ASSIGNSTATE(H);

	if (!st_W)
	{
		m_W = Compute_W_fromH(m_H, m_Tdb);
		st_W = true;
	}

	TPW(m_Tdb, m_P, m_W); //combination #4
}



void Psychrometry::TTwbRH(double Tdb, double Twb, double RH)
{
	//Combination #11
	//Input values: T and Twb as Celcius, RH 0-100

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(RH);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pw)
	{
		m_Pw = (m_RH / 100) * m_Pws;
		st_Pw = true;
	}

	if (!st_Tdp)
	{
		m_Tdp = FindTemperature(m_Pw);
		st_Tdp = true;
	}

	TTwbTdp(m_Tdb, m_Twb, m_Tdp); //Combination #2
}



void Psychrometry::TTdpH(double Tdb, double Tdp, double H)
{
	//Combination #12
	//Input values: T and Tdp as Celcius, H kJ / kg dry air

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(H);

	if (!st_W)
	{
		m_W = Compute_W_fromH(m_H, m_Tdb);
		st_W = true;
	}

	TTdpW(m_Tdb, m_Tdp, m_W); //Combination #7
}



void Psychrometry::TTwbH(double Tdb, double Twb, double H)
{
	//Combination #13
	//Input values: T and Twb as Celcius, H kJ/kg dry air

	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(H);


	if (!st_W)
	{
		m_W = Compute_W_fromH(m_H, m_Tdb);
		st_W = true;
	}

	TTwbW(m_Tdb, m_Twb, m_W); //Combination #9
}



void Psychrometry::TwbPW(double Twb, double P, double W)
{
	//Combination #14
	//Input values: Twb as Celcius, P as Pascal, W kg/ kg da

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(P);
	ASSIGNSTATE(W);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (m_P <= m_Pws_wb)
		throw std::runtime_error("Pws(@ Twb) >= P");


	if (!st_Ws_wb)
	{
		m_Ws_wb = Compute_W(m_P, m_Pws_wb);
		st_Ws_wb = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = Compute_Tdb(m_Ws_wb, m_W, m_Twb);
		st_Tdb = true;
	}

	TTwbP(m_Tdb, m_Twb, m_P); //combination #1
}



void Psychrometry::TwbTdpP(double Twb, double Tdp, double P)
{
	//Combination #15
	//Input values: Twb and Tdp as Celcius, P as Pascal

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(P);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Ws_wb)
	{
		m_Ws_wb = Compute_W(m_P, m_Pws_wb);
		st_Ws_wb = true;
	}


	if (!st_W)
	{
		m_W = Compute_W(m_P, m_Pw);
		st_W = true;
	}

	TwbPW(m_Twb, m_P, m_W); //Comb 14
}



//TODO: Most likely needs a fix
void Psychrometry::TwbWRH(double Twb, double W, double RH)
{
	//Combination #16
	//Input values: Twb as Celcius, W kg/ kg da, RH as %

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(W);
	ASSIGNSTATE(RH);


	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Tdb)
	{
		double diff = 0;
		int iter = 0, NofTries = 0;

		double T = m_Twb; //Start point

		//Temperature is divided into intervals of length 5C
		double XX = T, YY = T + 5.0;

		do
		{
			//Number of iterations in one interval can not be more than 30, skip to next interval
			//OR skip to next interval if XX is very close to YY there is no point to continue the iteration
			if ((iter > 30) || (std::abs(XX - YY) < 0.001))
			{
				NofTries++; //how many intervals to try

				XX = m_Twb + NofTries * 5.0;
				YY = XX + 5;

				iter = 0;
			}


			//If NofTries>40 we could not find the temperature in any of the intervals. It is assumed that the difference between
			//Dry-Bulb and Wet-Bulb temperature can not be greater than 200C since the maximum value
			//that can be send to FindPressure function is 200C
			if (NofTries > 40)
				return;

			iter++;

			T = (XX + YY) / 2;

			double Pws = FindPressure(T);
			double Pw = (m_RH / 100) * Pws;
			double P = 0.62198 * Pw / m_W + Pw;

			double Wsyas = Compute_W(P, m_Pws_wb);

			double Twb_numerical = Compute_Twb(Wsyas, m_W, T);

			diff = m_Twb - Twb_numerical;
			(diff > 0) ? XX = T : YY = T;
			
			if (std::abs(diff) < 0.001)
				break;

			//the reason it is selected 0.01 is at high temperatures Twb_numerical oscillates in very big ranges
			//for example lets say actual values of Twb=60 and Tdb=150
			//if Tdb is 151 which gives Twb_numerical as 60.01; however if Tdb is 154 then Twb_numerical becomes 80 suddenly
			//therefore in order to avoid this, the difference was selected as 0.01 which is reasonable, even could be 0.05
		} while (!(std::abs(diff) < 0.01));

		m_Tdb = T;
		st_Tdb = true;
	}

	TTwbW(m_Tdb, m_Twb, m_W); //Combination #9
}



void Psychrometry::TwbRHH(double Twb, double RH, double H)
{
	//Combination #17
	//Input values: Twb as Celcius, W kg/ kg da, RH as %

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(RH);
	ASSIGNSTATE(H);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}


	if (!st_Tdb)
	{
		double diff = 0;
		int iter = 0, NofTries = 0;

		double T = m_Twb; 

		//Temperature is divided into intervals of length 5C
		double XX = T, YY = T + 5.0;

		do
		{
			//Number of iterations in one interval can not be more than 30, skip to next interval
			//OR skip to next interval if XX is very close to YY there is no point to continue the iteration
			if ((iter > 30) || (std::abs(XX - YY) < 0.001))
			{
				//how many intervals to try
				NofTries++;

				XX = m_Twb + NofTries * 5.0;
				YY = XX + 5;

				iter = 0;
			}

			//If NofTries>40 we could not find the temperature in any of the intervals. It is assumed that the difference between
			//Dry-Bulb and Wet-Bulb temperature can not be greater than 200C since the maximum value
			//that can be send to FindPressure function is 200C
			if (NofTries > 40)
				return;

			iter++;

			T = (XX + YY) / 2;

			double _W = Compute_W_fromH(m_H, T);

			double Pws = FindPressure(T);
			double Pw = (m_RH / 100) * Pws;
			double P = 0.62198 * Pw / _W + Pw;

			double Wsyas = Compute_W(P, m_Pws_wb);
			double Twb_numerical = Compute_Twb(Wsyas, _W, T);

			diff = m_Twb - Twb_numerical;

			diff > 0 ? XX = T: YY = T;

			if (std::abs(diff) < 0.0001)
				break;
			//the reason it is selected 0.01 is at high temperatures Twb_numerical oscillates in very big ranges
			//for example lets say actual values of Twb=60 and Tdb=150
			//if Tdb is 151 which gives Twb_numerical as 60.01; however if Tdb is 154 then Twb_numerical becomes 80 suddenly
			//therefore in order to avoid this, the difference was selected as 0.01 which is reasonable, even could be 0.05

		} while (!(std::abs(diff) < 0.01));

		m_Tdb = T;
		st_Tdb = true;
	}

	TTwbH(m_Tdb, m_Twb, m_H); //Combination #13
}



void Psychrometry::TwbTdpW(double Twb, double Tdp, double W) //Comb #20
{
	//Combination #18
	//Input values: Twb and Tdp as Celcius, W kg/ kg da

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(W);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_P)
	{
		m_P = 0.62198 * m_Pw / m_W + m_Pw;
		st_P = true;
	}

	TwbTdpP(m_Twb, m_Tdp, m_P); //combination 15
}



void Psychrometry::TwbPRH(double Twb, double P, double RH) //Comb #21
{
	//Combination #19
	//Input values: Twb as Celcius, P as Pascal and RH is %

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(P);
	ASSIGNSTATE(RH);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Tdb)
	{
		double diff = 0;
		int iter = 0, NofTries = 0;
		
		double T = Twb;
		double XX = m_Twb, YY = m_Twb + 5.0;
		do
		{
			//Number of iterations in one interval can not be more than 30, skip to next interval
			//OR skip to next interval if XX is very close to YY there is no point to continue the iteration
			if ((iter > 30) || (std::abs(XX - YY) < 0.001))
			{
				NofTries++; //how many intervals to try

				XX = m_Twb + NofTries * 5.0;
				YY = XX + 5;

				iter = 0;
			}

			//If NofTries>40 we could not find the temperature in any of the intervals. It is assumed that the difference between
			//Dry-Bulb and Wet-Bulb temperature can not be greater than 200C since the maximum value
			//that can be send to FindPressure function is 200C
			if (NofTries > 40)
				return;

			iter++;

			T = (XX + YY) / 2;

			double Pws = FindPressure(T);
			double Pw = (m_RH / 100) * Pws;

			double W = Compute_W(m_P, Pw);
			double Wsyas = Compute_W(m_P, m_Pws_wb);

			double Twb_numerical = Compute_Twb(Wsyas, W, T);

			diff = m_Twb - Twb_numerical;
			(diff > 0) ? XX = T: YY = T;

			if (std::abs(diff) < 0.0001)
				break;
			//the reason it is selected 0.01 is at high temperatures Twb_numerical oscillates in very big ranges
			//for example lets say actual values of Twb=60 and Tdb=150
			//if Tdb is 151 which gives Twb_numerical as 60.01; however if Tdb is 154 then Twb_numerical becomes 80 suddenly
			//therefore in order to avoid this, the difference was selected as 0.01 which is reasonable, even could be 0.05
		} while (!(std::abs(diff) < 0.01));

		m_Tdb = T;
		st_Tdb = true;
	}

	TTwbP(m_Tdb, m_Twb, m_P); //Combination #1
}



void Psychrometry::TwbWH(double Twb, double W, double H)
{
	//Combination #20
	//Input values: Twb as Celcius, W as kg water/kg da, H as kJ/kg

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(W);
	ASSIGNSTATE(H);

	if (!st_Tdb)
	{
		m_Tdb = (m_H - 2501 * m_W) / (1 + 1.805 * m_W);
		st_Tdb = true;
	}

	TTwbH(m_Tdb, m_Twb, m_H); //comb 13
}



void Psychrometry::TwbTdpRH(double Twb, double Tdp, double RH)
{
	//Combination #21
	//Input values: Twb and Tdp as Celcius, RH %

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(RH);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Pws)
	{
		m_Pws = m_Pw / (m_RH / 100);
		st_Pws = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = FindTemperature(m_Pws);
		st_Tdb = true;
	}

	TTwbTdp(m_Tdb, m_Twb, m_Tdp); //Comb 2
}



void Psychrometry::TwbPH(double Twb, double P, double H)
{
	//Combination #22
	//Input values: Twb as Celcius, P as Pascal, H as kJ/kg da

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(P);
	ASSIGNSTATE(H);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Ws_wb)
	{
		m_Ws_wb = Compute_W(m_P, m_Pws_wb);
		st_Ws_wb = true;
	}

	if (!st_W)
	{
		double hg_star = m_Twb + (2501 + 1.805 * m_Twb) * m_Ws_wb;
		double hw = 4.186 * m_Twb;

		m_W = (m_H - hg_star) / hw + m_Ws_wb;
		st_W = true;
	}

	TwbPW(m_Twb, m_P, m_W); //comb 14
}



void Psychrometry::TwbTdpH(double Twb, double Tdp, double H)
{
	//Combination #23
	//Input values: Twb and Tdp as Celcius, H as kJ/kg da

	ASSIGNSTATE(Twb);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(H);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}


	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_P)
	{
		//To find the pressure Equations 9 and 15 are replaced into Equation 18
		//the resulting quadratic equation is solved
		double d = 0.62198 * m_Pws_wb;
		double e = (2501 + 1.805 * m_Twb) * 0.62198 * m_Pws_wb;
		double f = m_Twb - m_H;
		double g = 4.186 * m_Twb;
		double h = 0.62198 * m_Pw;
		double j = d * g - e + f * m_Pws_wb;
		double k = h * g;

		double A = f;
		double B = k - j - f * m_Pw;
		double C = j * m_Pw - k * m_Pws_wb;

		double Delta = pow(B, 2) - 4 * A * C;
		double x1 = 0, x2 = 0;

		if (Delta > 0)
		{
			x1 = (-B - pow(Delta, 0.5)) / (2 * A);
			x2 = (-B + pow(Delta, 0.5)) / (2 * A);

			(x1 > 0) ? m_P = x1 : m_P = x2;
		}

		else if (Delta == 0)
			m_P = (-B) / (2 * A);

		else if (Delta < 0)
			throw std::runtime_error("No real root could be found for P.");

		st_P = true;
	}


	TwbTdpP(m_Twb, m_Tdp, m_P); //Comb 15
}



//Combination 26 has no solution



void Psychrometry::TdpWRH(double Tdp, double W, double RH)
{
	//Combination #24
	//Input values: Tdp as Celcius, RH as %, W as kg/kg da

	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(W);
	ASSIGNSTATE(RH);

	//
	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Pws)
	{
		m_Pws = m_Pw / (m_RH / 100);
		st_Pws = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = FindTemperature(m_Pws);
		st_Tdb = true;
	}

	TTdpW(m_Tdb, m_Tdp, m_W); //Comb 7
}



void Psychrometry::TdpRHH(double Tdp, double RH, double H)
{
	//Combination #25
	//Input values: Tdp as Celcius, RH as %, H as kJ/kg da

	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(RH);
	ASSIGNSTATE(H);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Pws)
	{
		m_Pws = m_Pw / (m_RH / 100);
		st_Pws = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = FindTemperature(m_Pws);
		st_Tdb = true;
	}

	TTdpH(m_Tdb, m_Tdp, m_H); //Comb 12
}




void Psychrometry::TdpPRH(double Tdp, double P, double RH) //Comb #29??
{
	//Combination #26 ??
	//Input values: Tdp as Celcius, P as Pascal, RH as %

	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(P);
	ASSIGNSTATE(RH);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Pws)
	{
		m_Pws = m_Pw / (m_RH / 100);
		st_Pws = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = FindTemperature(m_Pws);
		st_Tdb = true;
	}

	TTdpP(m_Tdb, m_Tdp, m_P); //Comb 3
}




void Psychrometry::TdpWH(double Tdp, double W, double H)
{
	//Combination #27
	//Input values: Tdp as Celcius, W as kg/kg da, H as kJ/kg da

	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(W);
	ASSIGNSTATE(H);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_P)
	{
		m_P = 0.62198 * m_Pw / m_W + m_Pw;
		st_P = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = (m_H - 2501 * m_W) / (1 + 1.805 * m_W);
		st_Tdb = true;
	}

	TTdpH(m_Tdb, m_Tdp, m_H); //comb 12
}



void Psychrometry::TdpPH(double Tdp, double P, double H)
{
	//Combination #28
	//Input values: Tdp as Celcius, P as Pascal, H as kJ/kg da

	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(P);
	ASSIGNSTATE(H);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_W)
	{
		m_W = Compute_W(m_P, m_Pw);
		st_W = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = (m_H - 2501 * m_W) / (1 + 1.805 * m_W);
		st_Tdb = true;
	}

	TTdpP(m_Tdb, m_Tdp, m_P); //Comb #3
}



void Psychrometry::PWRH(double P, double W, double RH)
{
	//Combination #29
	//Input values: P as Pascal, W as kg/kg da, RH as %

	ASSIGNSTATE(P);
	ASSIGNSTATE(W);
	ASSIGNSTATE(RH);

	if (!st_Pw)
	{
		m_Pw = m_P * m_W / (m_W + 0.62198);
		st_Pw = true;
	}

	if (!st_Pws)
	{
		m_Pws = m_Pw / (m_RH / 100);
		st_Pws = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = FindTemperature(m_Pws);
		st_Tdb = true;
	}

	TPRH(m_Tdb, m_P, m_RH); //Comb 8
}



void Psychrometry::PRHH(double P, double RH, double H) //Comb #33
{
	//Combination #30
	//Input values: P as Pascal, RH as %, H as kJ/kg da,

	ASSIGNSTATE(P);
	ASSIGNSTATE(RH);
	ASSIGNSTATE(H);

	if (!st_Tdb)
	{
		double T = 0, _H = 0;

		//Lower and Upper bounds for temperature. Can not be beyond this limits
		double XX = -60; 
		double YY = 200; 
		do
		{
			T = (XX + YY) / 2;

			double Pws = FindPressure(T);
			double Pw = (m_RH / 100) * Pws;
			double _W = Compute_W(m_P, Pw);
			
			_H = T + _W * (2501 + 1.835 * T);

			((_H - m_H) < 0) ? XX = T : YY = T;

		} while (!(std::abs(_H - m_H) < 0.00001));

		m_Tdb = T;
		st_Tdb = true;
	}

	TPH(m_Tdb, m_P, m_H); //comb 10
}



void Psychrometry::PWH(double P, double W, double H)
{
	//Combination #31
	//Input values: P as Pascal, W as kg/kg da, H as kJ/kg da

	ASSIGNSTATE(P);
	ASSIGNSTATE(W);
	ASSIGNSTATE(H);

	if (!st_Tdb)
	{
		m_Tdb = (m_H - 2501 * m_W) / (1 + 1.805 * m_W);
		st_Tdb = true;
	}

	TPH(m_Tdb, m_P, m_H); //Comb #10
}



void Psychrometry::WRHH(double W, double RH, double H)
{
	//Combination #32
	//Input values: P as Pascal, RH as %, H as kJ/kg da

	ASSIGNSTATE(W);
	ASSIGNSTATE(RH);
	ASSIGNSTATE(H);

	if (!st_Tdb)
	{
		m_Tdb = (m_H - 2501 * m_W) / (1 + 1.805 * m_W);
		st_Tdb = true;
	}

	TRHH(m_Tdb, m_RH, m_H); //Comb #6
}



void Psychrometry::VTH(double V, double Tdb, double H)
{
	//Combination #33
	//Input values: T as C, H as kJ/kg da, V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(H);


	if (!st_W)
	{
		m_W = Compute_W_fromH(m_H, m_Tdb);
		st_W = true;
	}

	if (!st_P)
	{
		m_P = Ra * (m_Tdb + 273.15) * (1 + 1.6078 * m_W) / m_V;
		st_P = true;
	}

	TPW(m_Tdb, m_P, m_W); //comb #4
}



void Psychrometry::VTRH(double V, double Tdb, double RH)
{

	//Combination #34
	//Input values: T as C, RH as %, V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(RH);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pw)
	{
		m_Pw = (m_RH / 100) * m_Pws;
		st_Pw = true;
	}

	if (!st_Tdp)
	{
		m_Tdp = FindTemperature(m_Pw);
		st_Tdp = true;
	}


	//To obtain Absolute Humidity Eq 10 goes into Eq 28 and
	//the second-order equation that gives W is solved

	if (!st_W)
	{
		double x1 = 0, x2 = 0;

		double A = 1.6078 * Ra * (m_Tdb + 273.15);
		double B = Ra * (m_Tdb + 273.15) - m_Pw * m_V;
		double C = 0.62198 * m_Pw * m_V;

		double Delta = B * B + 4 * A * C;

		if (Delta == 0)
		{
			x1 = -B / (2 * A);
			m_W = x1;
		}

		else if (Delta > 0)
		{
			x1 = (-B + pow(Delta, 0.5)) / (2 * A);
			x2 = (-B - pow(Delta, 0.5)) / (2 * A);

			(x1 > 0) ? m_W = x1 :m_W = x2;
		}

		else if (Delta < 0)
			throw std::runtime_error("No real root could be found for W");

		st_W = true;
	}

	if (!st_P)
	{
		m_P = Ra * (m_Tdb + 273.15) * (1 + 1.6078 * m_W) / m_V;
		st_P = true;
	}


	TPW(m_Tdb, m_P, m_W); //comb #4
}



void Psychrometry::VTP(double V, double Tdb, double P)
{
	//Combination #35
	//Input values: T as C, P as Pa, V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(P);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	double A = (m_P * m_V) / (Ra * (m_Tdb + 273.15));

	if (!st_W)
	{
		m_W = (A - 1) / 1.6078;
		st_W = true;
	}

	TPW(m_Tdb, m_P, m_W); //comb #4
}



void Psychrometry::VTW(double V, double Tdb, double W)
{
	//Combination #36
	//Input values: T as C, W as kg water/kg da, V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(W);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_P)
	{
		m_P = Ra * (m_Tdb + 273.15) * (1 + 1.6078 * m_W) / m_V;
		st_P = true;
	}


	TPW(m_Tdb, m_P, m_W); //comb #4
}


void Psychrometry::VTTwb(double V, double Tdb, double Twb)
{
	//Combination #37
	//Input values: T and Twb as C,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdb);
	ASSIGNSTATE(Twb);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_P)
	{

		//Following is the bisection method to find the root of function f
		//First Fx and Fy are found to check if there is a root between the search range
		//variable tempP is equal to X(k) at k.th step

		double _P = 0, tolerance = 1E-5;

		//Lower range of pressure and pressure can not be smaller than pws  & YY is the upper range
		double XX = m_Pws; 
		double YY = 1555099;

		double _Wsyas = Compute_W(XX, m_Pws_wb);
		double _W = Compute_W(m_Twb, _Wsyas, m_Tdb);

		double Fx = XX * m_V - (1 + 1.6078 * _W) * Ra * (m_Tdb + 273.15);

		_Wsyas = Compute_W(YY, m_Pws_wb);
		_W = Compute_W(m_Twb, _Wsyas, m_Tdb);

		double Fy = YY * m_V - (1 + 1.6078 * _W) * Ra * (m_Tdb + 273.15);

		//Check if there is a root
		if (Fx * Fy < 0)
		{
			_P = XX;  //Start from lower range
			do
			{
				_Wsyas = Compute_W(_P, m_Pws_wb);
				_W = Compute_W(m_Twb, _Wsyas, m_Tdb);
				
				double f = _P * m_V - (1 + 1.6078 * _W) * Ra * (m_Tdb + 273.15);
				(f < 0) ? XX = _P : YY = _P;

				_P = (XX + YY) / 2;

			} while (!((std::abs(XX - YY) < tolerance)));
		}

		m_P = _P;
		st_P = true;
	}

	TTwbP(m_Tdb, m_Twb, m_P); //Comb #1
}



void Psychrometry::VTTdp(double V, double Tdb, double Tdp)
{
	//Combination #38
	//Input values: T and Tdp as C,V as kg/m3

	ASSIGNSTATE(V); 
	ASSIGNSTATE(Tdb); 
	ASSIGNSTATE(Tdp);

	if (!st_Pws)
	{
		m_Pws = FindPressure(m_Tdb);
		st_Pws = true;
	}

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_RH) 
	{ 
		m_RH = m_Pw / m_Pws * 100; 
		st_RH = true; 
	}

	VTRH(m_V, m_Tdb, m_RH); //Comb #34
}



void Psychrometry::VTwbTdp(double V, double Twb, double Tdp)
{
	//Combination #39
	//Input values: T and Tdp as C,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(Tdp);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Tdb)
	{
		/*
			Eq 9 is replaced into Eq 28 and Dry - bulb temperature is assumed to be equal to wet - bulb temperature
			Then Pressure is found from second-order equation
			by using Equation 9 and Equation 15 and 21 Dry-bulb temperature is found
			
			A,B,C are coefficients of second-order equation in firsthand but then as nominator and denominator
			TempTyas is found in every step and is aimed to approach varTyas which is taken from user
		*/
		constexpr double TOL = 1E-7;

		double _T = 0, _Tyas = 0, XX = 0, YY = 0;
		int iter = 0, interval = 0;

		_T = m_Twb; //the lowest value dry-bulb _erature can assume
		XX = _T; YY = XX + 10; //Create a span to search for the value of real _erature
		iter = 0;
		do
		{
			double _P = 0;

			_T = (XX + YY) / 2.0;

			double A = m_V / (Ra * (_T + 273.15));
			double B = -(A * m_Pw + 1);
			double C = -m_Pw + 1.6078 * 0.62198 * m_Pw;

			double Delta = B * B - 4 * A * C;
			if (Delta > 0)
			{
				double x1 = (-B + pow(Delta, 0.5)) / (2 * A);
				double x2 = (-B - pow(Delta, 0.5)) / (2 * A);
				
				_P = x1 > 0 ? x1 : x2;
			}

			else if (Delta == 0) 
				_P = -B / (2 * A); 
			else if (Delta < 0) 
				return;

			//Use the equation wherein specific volume is known
			double _W = ((_P * m_V) / (Ra * (_T + 273.15)) - 1) / 1.6078; 
			
			double _Wsyas = Compute_W(_P, m_Pws_wb);
			_Tyas = Compute_Twb(_Wsyas, _W, _T);

			((_Tyas - m_Twb) < 0) ? XX = _T: YY = _T;

			iter++;

			if (iter >= 20)
			{
				iter = 0; //reset iteration

				interval++; //look for the next interval for _erature

				XX = m_Twb + interval * 10; 
				YY = XX + 10; 
			}

		} while (!((std::abs(_Tyas - m_Twb) < TOL)));


		m_Tdb = _T;
		st_Tdb = true;
	}

	VTTwb(m_V, m_Tdb, m_Twb); //Comb #37
}


void Psychrometry::VTwbH(double V, double Twb, double H)
{
	//Combination #40
	//Input values: Twb as C, H as kJ/kg da,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(H);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Tdb)
	{
		double _Tyas = 0;
		double tolerance = 1.0E-5;
		int iter = 0, interval = 0;
		
		double _T = m_Twb;
		double XX = _T; 
		double YY = XX + 10;

		do
		{
			_T = (XX + YY) / 2.0;
			iter++;

			if (iter >= 20)
			{
				iter = 0;
				interval++; 

				XX = m_Twb + interval * 10; 
				YY = XX + 10; 
			}

			double _W = Compute_W_fromH(m_H, _T);

			double _P = Ra * (_T + 273.15) * (1 + 1.6078 * _W) / m_V;    //Equation 28

			double _Wsyas = Compute_W(_P, m_Pws_wb); 
			double _Hwyas = 4.186 * m_Twb;
			double _Hsyas = m_Twb + (2501 + 1.805 * m_Twb) * _Wsyas;

			_Wsyas = (_Hsyas - m_H) / _Hwyas + _W;      
			_Tyas = Compute_Twb(_Wsyas, _W, _T);

			((_Tyas - m_Twb) < 0) ? XX = _T: YY = _T;

		} while (!(std::abs(m_Twb - _Tyas) < tolerance));

		m_Tdb = _T;
		st_Tdb = true;
	}

	VTTwb(m_V, m_Tdb, m_Twb); //Comb 37
}


void Psychrometry::VTwbP(double V, double Twb, double P)
{
	//Combination #41
	//Input values: Twb as C, P as Pascal,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(P);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Tdb)
	{
		double _Tyas = 0;
		constexpr double TOL = 1.0E-5;
		int iter = 0, interval = 0;
		
		double _T = m_Twb;
		double XX = _T; 
		double YY = XX + 10;

		do
		{
			_T = (XX + YY) / 2.0;
			iter++;                 //Number of iterations

			if (iter >= 20)
			{
				iter = 0; //reset iteration
				interval++; //look for the next interval for _erature
				
				XX = m_Twb + interval * 10; //start of the interval
				YY = XX + 10; //end of the interval
			}

			double _W = ((m_P * m_V) / (Ra * (_T + 273.15)) - 1) / 1.6078;
			
			double _Wsyas = Compute_W(m_P, m_Pws_wb);
			_Tyas = Compute_Twb(_Wsyas, _W, _T);

			((_Tyas - m_Twb) < 0) ? XX = _T : YY = _T;

		} while (!(std::abs(m_Twb - _Tyas) < TOL));

		m_Tdb = _T;
		st_Tdb = true;
	}

	VTTwb(m_V, m_Tdb, m_Twb); //Comb 40
}


void Psychrometry::VTwbW(double V, double Twb, double W)
{
	//Combination #42
	//Input values: Twb as C, W as kg/kg da,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Twb);
	ASSIGNSTATE(W);

	if (!st_Pws_wb)
	{
		m_Pws_wb = FindPressure(m_Twb);
		st_Pws_wb = true;
	}

	if (!st_Tdb)
	{
		double _Tyas = 0;
		double tolerance = 1E-5;
		int iter = 0, interval = 0;
		
		double _T = m_Twb;
		double XX = _T; 
		double YY = XX + 10;

		do
		{
			_T = (XX + YY) / 2.0;
			iter++;

			if (iter >= 20)
			{
				iter = 0;
				interval++; 

				XX = m_Twb + interval * 10; 
				YY = XX + 10; 
			}

			double _P = Ra * (_T + 273.15) * (1 + 1.6078 * m_W) / m_V;

			double _Wsyas = Compute_W(_P, m_Pws_wb);
			_Tyas = Compute_Twb(_Wsyas, m_W, _T);

			((_Tyas - m_Twb) < 0) ? XX = _T : YY = _T;

		} while (!(std::abs(m_Twb - _Tyas) < tolerance));

		m_Tdb = _T;
		st_Tdb = true;
	}

	VTTwb(m_V, m_Twb, m_Twb); //Comb 37
}



void Psychrometry::VTdpH(double V, double Tdp, double H)
{
	//Combination #43
	//Input values: Tdp as C, H as kJ/kg da,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(H);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Tdb)
	{
		//Below BiSection Method is applied
		//Function's independent variable TempT and functions dependent variable is specific volume
		double _T = 0, _Tdp = 0;
		double tolerance = 1E-6;
		int iter = 0, interval = 0;

		double XX = m_Tdp; 
		double YY = XX + 10;
		do
		{
			_T = (XX + YY) / 2.0;

			iter++;
			if (iter >= 20)
			{
				iter = 0;
				interval++; //look for the next interval for temperature

				XX = m_Tdp + interval * 10; 
				YY = XX + 10; 
			}

			double _W = Compute_W_fromH(m_H, _T);
			double _P = Ra * (_T + 273.15) * (1 + 1.6078 * _W) / m_V;		
			double _Pw = _P * _W / (_W + 0.62198);
			_Tdp = FindTemperature(_Pw);

			((_Tdp - m_Tdp) < 0) ? XX = _T : YY = _T;

		} while (!(std::abs(_Tdp - m_Tdp) < tolerance));

		m_Tdb = _T;
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		std::runtime_error("Tdb must be in the range [-60, 200] C.");


	VTTdp(m_V, m_Tdb, m_Tdp); //Comb 38
}



void Psychrometry::VTdpP(double V, double Tdp, double P)
{

	//Combination #44
	//Input values: Tdp as C, P as Pascal,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(P);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_W) 
	{ 
		m_W = Compute_W(m_P, m_Pw); 
		st_W = true; 
	}

	if (!st_Tdb)
	{
		m_Tdb = (m_P * m_V) / (Ra * (1 + 1.6078 * m_W)) - 273.15; //Convert Kelvin back to Celcius
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");


	TTdpP(m_Tdb, m_Tdp, m_P);//comb #3
}



void Psychrometry::VTdpW(double V, double Tdp, double W)
{
	//Combination #45
	//Input values: Tdp as C, W as kg/kg da,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(W);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_P)
	{
		m_P = m_Pw * (0.62198 / m_W + 1);
		st_P = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = (m_P * m_V) / (Ra * (1 + 1.6078 * m_W)) - 273.15; //Convert Kelvin back to Celcius
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");

	TTdpP(m_Tdb, m_Tdp, m_P);//comb #3
}


void Psychrometry::VTdpRH(double V, double Tdp, double RH)
{
	//Combination #46
	//Input values: Tdp as C, RH as %,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(Tdp);
	ASSIGNSTATE(RH);

	if (!st_Pw)
	{
		m_Pw = FindPressure(m_Tdp);
		st_Pw = true;
	}

	if (!st_Pws)
	{
		m_Pws = m_Pw / (m_RH / 100);
		st_Pws = true;
	}

	if (!st_Tdb)
	{
		m_Tdb = FindTemperature(m_Pws);
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");


	VTTdp(m_V, m_Tdb, m_Tdp); //Comb #38
}



void Psychrometry::VPW(double V, double P, double W)
{
	//Combination #47
	//Input values: P as Pa, W as kg/kg da,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(P);
	ASSIGNSTATE(W);

	if (!st_Tdb)
	{
		m_Tdb = (m_P * m_V) / (Ra * (1 + 1.6078 * m_W)) - 273.15; //Convert Kelvin back to Celcius
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");

	TPW(m_Tdb, m_P, m_W); //Comb #4
}




void Psychrometry::VPH(double V, double P, double H)
{
	//Combination #48
	//Input values: P as Pa, H as kJ/kg da,V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(P);
	ASSIGNSTATE(H);

	if (!st_W)
	{
		double _W = 0, _W_new = 0;
		double tolerance = 1E-4;
		
		do
		{
			_W = _W_new;

			double f = m_P * m_V / (Ra * (1 + 1.6078 * _W)) - (m_H - 2501 * _W) / (1 + 1.805 * _W) - 273.15;

			//_der stands for derivative
			double f_der = 
				-1.6078 * Ra * m_P * m_V / pow((Ra * (1 + 1.6078 * _W)), 2) - 
				(-2501 * (1 + 1.805 * _W) - 
				1.805 * (m_H - 2501 * _W)) / pow((1 + 1.805 * _W), 2);

			_W_new = _W - f / f_der;

		} while (!(std::abs(_W_new - _W) < tolerance));

		m_W = _W_new;
		st_W = true;
	}

	VPW(m_V, m_P, m_W); //Comb 47
}



void Psychrometry::VPRH(double V, double P, double RH)
{
	//Combination #49
	//Input values: P as Pa, RH as %,V as kg/m3
	/*
	ALGORITHM MAKES ALMOST 15% ERROR WHEN FINDING TEMPERATURE
	Both bisection method (-60C,200C) and Newton-Raphson (initial guess -60C) gives the same
	temperature value for the same input. It was seen that the error comes from the finding of
	Absolute Humidity. Ex: P=101325, RH=59.008 and V=0.8419 -> T is found as=23.94C by both methods
	Although W in this case should be 0.0085 (when T=20C) it is found as 0.0001 and that's why temperature is found as 23.94C
	Documentation of function is available in the Word document
	*/
	//
	ASSIGNSTATE(V);
	ASSIGNSTATE(P);
	ASSIGNSTATE(RH);

	if (!st_Tdb)
	{
		/*
			Following is the Newton-Raphson method
			Function is formed by replacing Eq 9 and 25 into Eq 28
			f=PV/Ra-(1+1.6078W)*T --> initial guess is the lowest bound of temperature, -60C

			_der stands for derivative
		*/
		double f = 0, f_der = 0, W_der = 0, Pws_der = 0, _W = 0, _Pws = 0;
		double XX = 0, XX_new = -60; //initial guess

		do
		{
			XX = XX_new;

			_Pws = FindPressure(XX);
			double Pw = (m_RH / 100) * _Pws;
			_W = Compute_W(m_P, Pw);

			f = (XX + 273.15) * (1 + 1.6078 * _W) - (m_P * m_V) / Ra;

			double TT = XX + 0.001;

			//Derivative
			Pws_der = (FindPressure(TT) - FindPressure(XX)) / (TT - XX);
			double Pw_der = (m_RH / 100) * Pws_der;

			W_der = (0.62198 * Pw_der * (m_P - Pw) + Pw_der) / pow((m_P - Pw), 2.0);
			f_der = (1 + 1.6078 * _W) + (1.6078 * W_der) * (XX + 273.15);

			XX_new = XX - f / f_der;

		} while (!(std::abs(XX_new - XX) < 0.00001));

		m_Tdb = XX;
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");


	TPRH(m_Tdb, m_P, m_RH); //Comb #8
}



void Psychrometry::VWRH(double V, double W, double RH)
{
	//Combination #50
	//Input values: W as kg/kg da,RH as %, V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(W);
	ASSIGNSTATE(RH);

	if (!st_Tdb)
	{
		/*This part of the CODE and the COMMENTS are taken from the VB version written in 2004-2005
		It has been just been modified to C++
		Following is the BiSection solution of function
		Function is denoted by F and is acquired by replacing Eq 10 and Eq 24 and Eq 1 into Eq 28
		Search is done until F(T) approximates to zero
		*/
		double _T = 0, _Pws = 0, f = 0, A = 0;
		double XX = -60, YY = 200;   //Range for temperature--> In the VB Code XX=-100

		A = (m_V / m_W) / (Ra * (1 + 1.6078 * m_W));

		do
		{
			_T = (XX + YY) / 2.0;

			_Pws = FindPressure(_T);
			f = A - (_T + 273.15) / (0.62198 * (m_RH / 100) * _Pws + (m_RH / 100) * _Pws * m_W);

			(f < 0) ? XX = _T : YY = _T;

		} while (!(std::abs(f) < 0.0001));

		m_Tdb = _T;
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");

	VTW(m_V, m_Tdb, m_W); //Comb 36
}



void Psychrometry::VRHH(double V, double RH, double H)
{
	//Combination #51
	//Input values: RH as %,H as kJ/kg da, V as kg/m3

	ASSIGNSTATE(V);
	ASSIGNSTATE(RH);
	ASSIGNSTATE(H);

	if (!st_Tdb)
	{
		double _T = 0, _W = 0, _Pws = 0, _Pw = 0, _P = 0, f = 0;
		double XX = -60, YY = m_H; //m_H is always greater than _erature so a reasonable uppper bound

		/*This part of the CODE and the COMMENTS are taken from the VB version written in 2004-2005
		It has been just been modified to C++
		Following is the BiSection solution of function
		*/
		do
		{
			_T = (XX + YY) / 2.0;

			_Pws = FindPressure(_T);
			_W = Compute_W_fromH(m_H, _T);

			_Pw = (m_RH / 100) * _Pws;
			_P = 0.62198 * _Pw / _W + _Pw;
			f = _P * m_V - (1 + 1.6078 * _W) * Ra * (_T + 273.15);

			(f < 0) ? XX = _T : YY = _T;

		} while (!(std::abs(f) < 0.00001));

		m_Tdb = _T;
		st_Tdb = true;
	}

	if (m_Tdb < -60 || m_Tdb>200)
		throw std::runtime_error("Tdb must be in the range [-60,200] C.");

	VTRH(m_V, m_Tdb, m_RH); //Comb 34
}