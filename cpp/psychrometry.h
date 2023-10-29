#include <string>
#include <vector>
#include <optional>

template <typename ForwardIt, typename T>
std::optional<size_t> binary_search_index(ForwardIt first, ForwardIt last, const T& val)
{
	auto search = std::lower_bound(first, last, val);

	if (search == last || (search == first && val < *search))
		return std::nullopt;

	return std::distance(first, search);
}



inline bool is_inrange(const double& Value, const double& min, const double& max, const double& Expansion = 1E-5)
{
	double ExpandedMin = min - Expansion;
	double ExpandedMax = max + Expansion;

	return Value >= ExpandedMin && Value <= ExpandedMax;
}


class Psychrometry
{
public:
	Psychrometry() = default;

	std::string to_str();
	std::string to_json();

	void Compute(
		std::vector<std::string> keys, 
		std::vector<double> values);


	void TTwbTdp(double T, double Twb, double Tdp); //Comb #1

	void TTdpP(double T, double Tdp, double P); //Comb #2

	void TPW(double T, double P, double W); //Comb #3

	void TWRH(double T, double W, double RH); //Comb #4

	void TRHH(double T, double RH, double H); //Comb #5

	void TTwbP(double T, double Twb, double P); //Comb #6

	void TTdpW(double T, double Tdp, double W); //Comb #7

	//Tdb as Celcius, P as Pascal and RH %
	void TPRH(double T, double P, double RH); //Comb #8

	//void TWH(double T, double W, double H); //Comb #9

	void TTwbW(double T, double Twb, double W); //Comb #10

	void TPH(double T, double P, double H); //Comb #12

	void TTwbRH(double T, double Twb, double RH); //Comb #13

	void TTdpH(double T, double Tdp, double H); //Comb #14

	void TTwbH(double T, double Twb, double H); //Comb #15

	void TwbPW(double Twb, double P, double W); //Comb #16

	void TwbTdpP(double Twb, double Tdp, double P); //Comb #17

	void TwbWRH(double Twb, double W, double RH); //Comb #18

	void TwbRHH(double Twb, double RH, double H); //Comb #19

	void TwbTdpW(double Twb, double Tdp, double W); //Comb #20

	void TwbPRH(double Twb, double P, double RH); //Comb #21

	void TwbWH(double Twb, double W, double H); //Comb #22

	void TwbTdpRH(double Twb, double Tdp, double RH); //Comb #23

	void TwbPH(double Twb, double P, double H); //Comb #24

	void TwbTdpH(double Twb, double Tdp, double H); //Comb #25

	void TdpWRH(double Tdp, double W, double RH); //Comb #27

	void TdpRHH(double Tdp, double RH, double H); //Comb #28

	void TdpPRH(double Tdp, double P, double RH); //Comb #29

	void TdpWH(double Tdp, double W, double H); //Comb #30

	void TdpPH(double Tdp, double P, double H); //Comb #31

	void PWRH(double P, double W, double RH); //Comb #32

	void PRHH(double P, double RH, double H); //Comb #33

	void PWH(double P, double W, double H); //Comb #34

	void WRHH(double W, double RH, double H); //Comb #35


	//

	void VTH(double V, double T, double H);

	void VTRH(double V, double T, double RH);

	void VTP(double V, double T, double P);

	void VTW(double V, double T, double W);

	void VTTwb(double V, double T, double Twb);

	void VTTdp(double V, double T, double Tdp);

	void VTwbTdp(double V, double Twb, double Tdp);

	void VTwbH(double V, double Twb, double H);

	void VTwbP(double V, double Twb, double P);

	void VTwbW(double V, double Twb, double W);

	void VTdpH(double V, double Tdp, double H);

	void VTdpP(double V, double Tdp, double P);

	void VTdpW(double V, double Tdp, double W);

	void VTdpRH(double V, double Tdp, double RH);

	void VPW(double V, double P, double W);

	void VPH(double V, double P, double H);

	void VPRH(double V, double P, double RH);

	void VWRH(double V, double W, double RH);

	void VRHH(double V, double RH, double H);

	//returns Celcius, Pws is Pascal
	double FindTemperature(double P);

	//T, temperature is in Celcius, function returns in Pascal
	double FindPressure(double T);

	//T�C, returns kJ/kg�C
	double Cp_DryAir(double T);

	void ResetState();

	double getP() const 
	{ 
		return m_P; 
	}

	double getPw() const 
	{ 
		return m_Pw; 
	}

	double getPws() const 
	{ 
		return m_Pws; 
	}

	double getPws_wb() const 
	{ 
		return m_Pws_wb; 
	}

	double getTdb() const 
	{ 
		return m_Tdb; 
	}

	double getTwb() const 
	{ 
		if (m_RH > 90 && m_Tdp > m_Twb)
			return m_Tdp;

		return m_Twb; 
	}

	double getTdp() const 
	{ 
		if (m_RH > 90 && m_Tdp > m_Twb)
			return m_Twb;

		return m_Tdp;
	};

	double getW() const 
	{ 
		return m_W; 
	}

	double getWs() const 
	{ 
		return varWs; 
	}

	double getWs_wb() const 
	{
		return m_Ws_wb; 
	}

	double getH() const 
	{
		return m_H;
	}
	
	double getRH() const 
	{
		return m_RH;
	}

	double getV() const 
	{
		return m_V; 
	}


private:
	
	//Function to find wet bulb temperature
	double Twb1521(double P, double W, double T);

	//equation #9
	double Compute_W(double P, double Pw);

	double Compute_W_fromH(double H, double T);

	//equation #20
	double Compute_W(double Twb, double Ws_wb, double Tdb);

	//equation #21
	double Compute_Twb(double Ws_wb, double W, double Tdb);

	//equation #21
	double Compute_Twb_LowW(double Ws_wb, double Tdb);

	//equation #23
	double Compute_Tdb(double Ws_wb, double W, double Twb);

	//equation #28
	double Compute_V(double Tdb, double W, double P);


private:
	double Ra{ 287.055 }; //kJ.kgK

	bool st_P{ false }, st_Pw{ false }, st_Pws{ false }, st_Pws_wb{ false };
	bool st_Tdb{ false }, st_Tdp{ false }, st_Twb{ false };
	bool st_W{ false }, st_Ws{ false }, st_Ws_wb{ false };
	bool st_H{ false }, st_RH{ false }, st_V{ false };

	double m_P{ 0.0 }; // Pa
	double m_Pw{ 0.0 }, m_Pws{ 0.0 }, m_Pws_wb{ 0.0 }; //Pa
	double m_Tdb{ 0.0 }, m_Tdp{ 0.0 }, m_Twb{ 0.0 }; //Celcius
	double m_W{ 0.0 }, varWs{ 0.0 }, m_Ws_wb{ 0.0 }; // kg/ kg da
	double m_H{ 0.0 }; // kJ/ kg da
	double m_RH{ 0.0 }; //%
	double m_V{ 0.0 }; //m3/kg da
};
