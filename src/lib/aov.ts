//ANALYSIS OF VARIANCE

export function aov_oneway(args: number[][])
{
	let SS_Treatment = 0, SS_Error = 0, SS_Total = 0;
	let NEntries = 0;

	//C is a variable defined to speed up computations (see Larsen Marx Chapter 12 on ANOVA)
	let C = 0;

	//Required for Tukey test
	let Averages:number[] = [];
	let SampleSizes:number[] = [];

	for(let elem of args)
	{
		let ElemSize = elem.length;
		let LocalSum=0
		
		for(let entry of elem)
		{
			LocalSum += entry;
			SS_Total += Math.pow(entry, 2.0);
		}
		
		Averages.push(LocalSum/ElemSize)
		SampleSizes.push(ElemSize) 

		C += LocalSum
		NEntries += ElemSize
		SS_Treatment += LocalSum**2/ElemSize
	}

	C = C**2 / NEntries
		
	SS_Total = SS_Total - C
	SS_Treatment = SS_Treatment - C
	SS_Error = SS_Total - SS_Treatment

	let DFError = NEntries-args.length;
	let DFTreatment = args.length-1;
	let DF_Total = DFError + DFTreatment;

	let MS_Treatment = SS_Treatment/DFTreatment; 
	let MSError = SS_Error/DFError;

	let Fvalue = MS_Treatment/MSError;

	let pvalue = 1 - (window.api.stat.dist.pf(Fvalue, DFTreatment, DFError) as number);

	let Dict = 
	{
		"pvalue":pvalue,
		"DF_Treatment":DFTreatment,
		'SS__Treatment':SS_Treatment, 
		'MS_Treatment':MS_Treatment,
		"DF_Error":DFError, 
		'SS_Error':SS_Error, 
		'MS_Error':MSError,
		"DF_Total": DF_Total, 
		'SS_Total':SS_Total, 
		'MS_Total': SS_Total/DF_Total,
		"Fvalue": Fvalue,
		//
		"Averages":Averages,
		"Sample_Sizes":SampleSizes
	}
	

	return Dict;
}

function tukey(Alpha: number, anovaResult:Object): Array
{
/*
	perform tukey test \n
	tukey(Alpha)-> list
*/

if(len(self.m_Averages) == 0):
	raise RuntimeError("first compute must be called")

if(isinstance(Alpha, numbers.Number) == False):
	raise TypeError("Alpha must be of type number")

D = qdist(1-Alpha, self.m_DFTreatment-1, self.m_DFError-1) / math.sqrt(self.m_SampleSizes[0])
ConfIntervalLength = D*math.sqrt(self.m_MSError)

self.m_TukeyTable=[]
for i in range(len(self.m_Averages)):
	for j in range(i+1, len(self.m_Averages)):
		MeanValueDiff = self.m_Averages[i]-self.m_Averages[j]
		ConfInterval1 = MeanValueDiff-ConfIntervalLength
		ConfInterval2 = MeanValueDiff+ConfIntervalLength

		com = self.TukeyComparison()

		com.m_a=i
		com.m_b=j
		com.m_MeanValueDiff=MeanValueDiff
		com.m_CILow = min(ConfInterval1,ConfInterval2)
		com.m_CIHigh = max(ConfInterval1,ConfInterval2)

		self.m_TukeyTable.append(com)

return self.m_TukeyTable
}