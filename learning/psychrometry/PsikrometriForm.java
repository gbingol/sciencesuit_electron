// 26 Haziran 2001 17:30
import java.awt.*;
import java.applet.*;
import java.awt.event.*;
import java.text.*;
import java.net.*;
import PsikrometrikFonksiyonlar;
import Fluids.SuOzellikleri;
public class PsikrometriForm extends java.applet.Applet{
	double varRH,varH,varT,varTyas,varTd,varP,varPw,varPws,varPwsyas,varW,varWs,varWsyas;
	double varHeight;
	Button Hesapla,Reset;
	Choice chP,chPw,chPws,chPwsyas;
	Choice chT,chTd,chTyas;
	Choice chW,chWs,chWsyas,chH,chRH,chHeight;
	Choice MyDigit;
	Checkbox chkP,chkT,chkTd,chkTyas;
	Checkbox chkW,chkH,chkRH;
	Label lblP,lblPw,lblPws,lblPwsyas;
	Label lblT,lblTd,lblTyas;
	Label lblW,lblWs,lblWsyas;
	Label lblH,lblRH,lblHeight;
	TextField txtP,txtPw,txtPws,txtPwsyas;
	TextField txtT,txtTd,txtTyas;
	TextField txtW,txtWs,txtWsyas;
	TextField txtH,txtRH,txtHeight;
	Panel left,lefttop,leftbottom;
	Color c;
	//Msgbox msgbox,msgbox1,msgbox2,msgbox3;
	Font MyFont=new Font("TimesRoman",Font.BOLD,12);
	double[] basinc={1,101325,100000,6894.7336073864,133.322368421053,14037.676918895,
				133.322368421053,47.87999999,6895};
	double[] basincto={1,9.86923266716013e-6,0.00001,1.4503824327685e-4,7.5006168270417e-3,
				7.12368581908572e-5,7.5006168270417e-3,2.08855472013367e-2,1.45032632342277e-4};
	double[] entalpito={1,0.239234449760766,1e10,0.947813394498891,3.7249494772e-4,2.77769e-4};
	double[] RH={1,100};
	double[] RHfrom={1,0.01};
	double[] nemto={1,1000};
	double[] nem={1,0.001};
	String[] struzunluk={"meter","dm","cm","micrometer","A�","km","inch","feet","Yard","Sea Mile",
					"Mile","Fathom","Furlong","Light Year","Parsec"};
	double[] uzunluk={1,10,100,1e6,1e9,1e-3,39.370078740,3.2808,1.0936,5.3996e-4,
					6.2137e-4,0.5467468562,4.970178926e-3,1.057023e-16,3.240779e-17};
	public void init(){
		c=new Color(150,190,200);
		setBackground(c);
		//Paneller olu�turuluyor
		//
		left=new Panel();
		left.setLayout(new BorderLayout());
		lefttop=new Panel();
		lefttop.setLayout(new GridLayout(14,3,2,7));
		leftbottom=new Panel(new GridBagLayout());
		GridBagConstraints gbc=new GridBagConstraints();
		//Choice nesnesi olu�turuluyor
		//
		MyDigit=new Choice();
		MyDigit.resize(7,7);
		MyDigit.addItem("1 Digit");MyDigit.addItem("2 Digit");MyDigit.addItem("3 Digit");MyDigit.addItem("4 Digit");MyDigit.addItem("6 Digit");
		chP=new Choice();
		chP.setFont(MyFont);
		chP.addItem("Pa");chP.addItem("Atm");chP.addItem("Bar");chP.addItem("Psia");//Bas�n� se�im listesi 
		chP.addItem("mm-Hg");chP.addItem("inHg");chP.addItem("Torr");chP.addItem("lb/ft2");chP.addItem("lb/in2");
		chPw=new Choice();
		chPw.setFont(MyFont);
		chPw.addItem("Pa");chPw.addItem("Atm");chPw.addItem("Bar");chPw.addItem("Psia");//Pw se�im listesi 
		chPw.addItem("mm-Hg");chPw.addItem("inHg");chPw.addItem("Torr");chPw.addItem("lb/ft2");chPw.addItem("lb/in2");
		chPws=new Choice();
		chPws.setFont(MyFont);
		chPws.addItem("Pa");chPws.addItem("Atm");chPws.addItem("Bar");chPws.addItem("Psia");//Pws se�im listesi 
		chPws.addItem("mm-Hg");chPws.addItem("inHg");chPws.addItem("Torr");chPws.addItem("lb/ft2");chPws.addItem("lb/in2");
		chPwsyas=new Choice();
		chPwsyas.setFont(MyFont);
		chPwsyas.addItem("Pa");chPwsyas.addItem("Atm");chPwsyas.addItem("Bar");chPwsyas.addItem("Psia");//Pwsyas se�im listesi 
		chPwsyas.addItem("mm-Hg");chPwsyas.addItem("inHg");chPwsyas.addItem("Torr");chPwsyas.addItem("lb/ft2");chPwsyas.addItem("lb/in2");
		//S�cakl�k i�in Choice se�im listesi haz�rlan�yor
		chT=new Choice();chT.setFont(MyFont);
		chT.addItem("�C");chT.addItem("�F");chT.addItem("K");
		chTd=new Choice();chTd.setFont(MyFont);
		chTd.addItem("�C");chTd.addItem("�F");chTd.addItem("K");
		chTyas=new Choice();chTyas.setFont(MyFont);
		chTyas.addItem("�C");chTyas.addItem("�F");chTyas.addItem("K");
		//Nem i�in Choice se�im listesi haz�rlan�yor
		chW=new Choice();chW.setFont(MyFont);
		chW.addItem("kg water/kg dry air");chW.addItem("g water/kg dry air");
		chWs=new Choice();chWs.setFont(MyFont);
		chWs.addItem("kg water/kg dry air");chWs.addItem("g water/kg dry air");
		chWsyas=new Choice();chWsyas.setFont(MyFont);
		chWsyas.addItem("kg water/kg dry air");chWsyas.addItem("g water/kg dry air");
		//Entalpi i�in Choice se�im listesi
		chH=new Choice();chH.setFont(MyFont);
		chH.addItem("kJ/kg");chH.addItem("kcal/kg");chH.addItem("erg/kg");chH.addItem("Btu/kg*s");chH.addItem("HP/kg");chH.addItem("kWh/kg");
		chRH=new Choice();chRH.setFont(MyFont);chRH.addItem("-");chRH.addItem("%");
		chHeight=new Choice();chHeight.setFont(MyFont);
		for(int i=0;i<struzunluk.length;i++){chHeight.addItem(struzunluk[i]);}
		//Checkbox nesnesi olu�turuluyor
		//
		Font MyFont2=new Font("Arial",Font.BOLD,10);
		chkP=new Checkbox("P Pressure");chkP.setFont(MyFont2);chkP.setBackground(c);
		chkT=new Checkbox("T Dry-bulb Temperature");chkT.setFont(MyFont2);chkT.setBackground(c);
		chkTd=new Checkbox("TD Dew-point temperature");chkTd.setFont(MyFont2);chkTd.setBackground(c);
		chkTyas=new Checkbox("T* Wet-bulb temperature");chkTyas.setFont(MyFont2);chkTyas.setBackground(c);
		chkW=new Checkbox("W  Humidity Ratio");chkW.setFont(MyFont2);chkW.setBackground(c);
		chkH=new Checkbox("H  Entalphy");chkH.setFont(MyFont2);chkH.setBackground(c);
		chkRH=new Checkbox("RH  Relative Humidity");chkRH.setFont(MyFont2);chkRH.setBackground(c);
		//TextField nesnesi olu�turuluyor
		//
		txtP=new TextField(12);
		txtPw=new TextField(12);
		txtPws=new TextField(12);
		txtPwsyas=new TextField(12);
		txtT=new TextField(12);
		txtTd=new TextField(12);
		txtTyas=new TextField(12);
		txtW=new TextField(12);
		txtWs=new TextField(12);
		txtWsyas=new TextField(12);
		txtH=new TextField(12);
		txtRH=new TextField(12);validate();
		txtHeight=new TextField(12);
		//Label nesnesi olu�turuluyor
		//
		lblP=new Label("Pressure");lblP.setFont(MyFont2);
		lblPw=new Label("Pw");lblPw.setFont(MyFont2);lblPw.setAlignment(Label.RIGHT);
		lblPws=new Label("Pws");lblPws.setFont(MyFont2);lblPws.setAlignment(Label.RIGHT);
		lblPwsyas=new Label("Pws*");lblPwsyas.setFont(MyFont2);lblPwsyas.setAlignment(Label.RIGHT);
		lblT=new Label("Dry-bulb temperature");lblT.setFont(MyFont2);
		lblTd=new Label("Dew-point temperature");lblTd.setFont(MyFont2);
		lblTyas=new Label("Wet-bulb temperature");lblTyas.setFont(MyFont2);
		lblW=new Label("Humidity Ratio");lblW.setFont(MyFont2);
		lblWs=new Label("Ws");lblWs.setFont(MyFont2);lblWs.setAlignment(Label.RIGHT);
		lblWsyas=new Label("Ws*");lblWsyas.setFont(MyFont2);lblWsyas.setAlignment(Label.RIGHT);
		lblH=new Label("Entalphy");lblH.setFont(MyFont2);
		lblRH=new Label("Humidity Ratio");lblRH.setFont(MyFont2);
		lblHeight=new Label("Altitude");lblHeight.setFont(MyFont2);lblHeight.setAlignment(Label.RIGHT);
		//
		Hesapla	=new Button("Calculate");
		Reset=new Button("Reset");Reset.resize(7,7);leftbottom.resize(14,7);validate();
		//Form �zerine olu�turulan nesneler yerle�tirilecek
		//
		lefttop.add(chkT);lefttop.add(txtT);lefttop.add(chT);
		lefttop.add(chkTd);lefttop.add(txtTd);lefttop.add(chTd);
		lefttop.add(chkTyas);lefttop.add(txtTyas);lefttop.add(chTyas);
		lefttop.add(chkP);lefttop.add(txtP);lefttop.add(chP);
		lefttop.add(chkW);lefttop.add(txtW);lefttop.add(chW);
		lefttop.add(lblWs);lefttop.add(txtWs);lefttop.add(chWs);
		lefttop.add(lblWsyas);lefttop.add(txtWsyas);lefttop.add(chWsyas);
		//
		//Bas�n� ile ilgili nesneler GridLayout(3,3) eklenecek
		lefttop.add(lblPw);lefttop.add(txtPw);lefttop.add(chPw);
		lefttop.add(lblPws);lefttop.add(txtPws);lefttop.add(chPws);
		lefttop.add(lblPwsyas);lefttop.add(txtPwsyas);lefttop.add(chPwsyas);
		lefttop.add(chkH);lefttop.add(txtH);lefttop.add(chH);
		lefttop.add(chkRH);lefttop.add(txtRH);lefttop.add(chRH);
		lefttop.add(lblHeight);lefttop.add(txtHeight);lefttop.add(chHeight);
		gbc.weightx=50;gbc.weighty=10;gbc.fill=GridBagConstraints.NONE;gbc.gridx=0;gbc.gridy=0;gbc.anchor=GridBagConstraints.WEST;leftbottom.add(MyDigit);
		gbc.weightx=50;gbc.weighty=10;gbc.fill=GridBagConstraints.NONE;gbc.gridx=1;gbc.gridy=0;gbc.anchor=GridBagConstraints.CENTER;leftbottom.add(Reset);
		lefttop.add(leftbottom);
		//Panellere ekleme yap�lacak
		left.add("North",lefttop);
		add(left);
		add(Hesapla);
		//msgbox2=new Msgbox(new Frame(),"This software is written by G�khan BINGOL by help of Prof.Dr. Y. Onur DEVRES ");
		//msgbox2.show();
}//init
	public boolean action(Event evt,Object o){
		if(evt.target.equals(Hesapla)){
			//Hesapla butonuna bas�l�rsa
			if((chkP.getState()==true)&&(chkT.getState()==true)&&(chkTyas.getState()==true)) TTyasP();
			if((chkH.getState()==true)&&(chkT.getState()==true)&&(chkTyas.getState()==true)) TTyasH();
			if((chkTyas.getState()==true)&&(chkTd.getState()==true)&&(chkP.getState()==true)) TyasTdP();
			if(chkT.getState()==true&&chkTyas.getState()==true&&chkW.getState()==true) TTyasW();
			if(chkTyas.getState()==true&&chkW.getState()==true&&chkH.getState()==true) TyasWH();
			if(chkTyas.getState()==true&&chkP.getState()==true&&chkH.getState()==true) TyasPH();
			if(chkT.getState()==true&&chkTyas.getState()==true&&chkTd.getState()==true) TTyasTd();
			if(chkT.getState()==true&&chkTd.getState()==true&&chkP.getState()==true) TTdP();
			if(chkT.getState()==true&&chkW.getState()==true&&chkP.getState()==true) TWP();
			if(chkTyas.getState()==true&&chkP.getState()==true&&chkW.getState()==true) TyasPW();
			if(chkTyas.getState()==true&&chkTd.getState()==true&&chkW.getState()==true) TyasTdW();
			if(chkT.getState()==true&&chkW.getState()==true&&chkRH.getState()==true) TWRH();
			if(chkT.getState()==true&&chkRH.getState()==true&&chkH.getState()==true) TRhH();
			if(chkT.getState()==true&&chkTd.getState()==true&&chkW.getState()==true) TTdW();
			if(chkT.getState()==true&&chkRH.getState()==true&&chkP.getState()==true) TRhP();
			if(chkTd.getState()==true&&chkW.getState()==true&&chkRH.getState()==true) TdWRh();
			if(chkT.getState()==true&&chkH.getState()==true&&chkP.getState()==true) THP();
			if(chkT.getState()==true&&chkH.getState()==true&&chkTd.getState()==true) THTd();
			if(chkTd.getState()==true&&chkRH.getState()==true&&chkH.getState()==true) TdRhH();
			if(chkTd.getState()==true&&chkP.getState()==true&&chkRH.getState()==true) TdPRh();
			if(chkTd.getState()==true&&chkW.getState()==true&&chkH.getState()==true) TdWH();
			if(chkTd.getState()==true&&chkP.getState()==true&&chkH.getState()==true) TdPH();
			if(chkP.getState()==true&&chkW.getState()==true&&chkRH.getState()==true) PWRh();
			if(chkP.getState()==true&&chkW.getState()==true&&chkH.getState()==true) PWH();
			if(chkW.getState()==true&&chkRH.getState()==true&&chkH.getState()==true) WRhH();
			if(chkP.getState()==true&&chkRH.getState()==true&&chkH.getState()==true) PRhH();
			if(chkT.getState()==true&&chkTyas.getState()==true&&chkRH.getState()==true) TTyasRh();
			if(chkTyas.getState()==true&&chkTd.getState()==true&&chkRH.getState()==true) TyasTdRh();
			if(chkTyas.getState()==true&&chkTd.getState()==true&&chkH.getState()==true) TyasTdH();
			if(chkTyas.getState()==true&&chkRH.getState()==true&&chkP.getState()==true) TyasRhP();
			if(chkTyas.getState()==true&&chkRH.getState()==true&&chkH.getState()==true) TyasRhH();
			if(chkTyas.getState()==true&&chkW.getState()==true&&chkRH.getState()==true) TyasWRh();
			FindHeight(txtP,txtHeight);
			FormatTextFields();
		}//if
		else if(evt.target.equals(Reset)){
			stop();
			//msgbox3=new Msgbox(new Frame(),"If this button does not funtion use the refresh button of your browser.");
			//msgbox3.show();
		}
		if (evt.target instanceof Choice){
			//Choice'lara bas�l�rsa
			Choicelarabasildi(evt);
		}
		return true;
	}//action
	//
	public void stop(){
		varP=0;varT=0;varTd=0;varTyas=0;varPw=0;varPws=0;varPwsyas=0;
		varW=0;varWs=0;varWsyas=0;varH=0;varRH=0;varHeight=0;
		txtP.setText("");txtPw.setText("");txtPws.setText("");txtPwsyas.setText("");txtT.setText("");txtTd.setText("");
		txtTyas.setText("");txtW.setText("");txtWs.setText("");txtWsyas.setText("");txtH.setText("");
		txtRH.setText("");txtHeight.setText("");
		if(chkP.getState()==true) chkP.setState(false);
		if(chkT.getState()==true) chkT.setState(false);
		if(chkTd.getState()==true) chkTd.setState(false);
		if(chkTyas.getState()==true) chkTyas.setState(false);
		if(chkW.getState()==true) chkW.setState(false);
		if(chkH.getState()==true) chkH.setState(false);
		if(chkRH.getState()==true) chkRH.setState(false);
	}
	public void Choicelarabasildi(Event e){
		//Choice'lara bas�larak birim �evirme sa�lan�r.
		if(((varP!=0)&&(e.target.equals(chP)))) FormatDigit(txtP,varP,chP,basincto);
		if((varPw!=0&&e.target.equals(chPw))) FormatDigit(txtPw,varPw,chPw,basincto);
		if(varPws!=0&&e.target.equals(chPws)) FormatDigit(txtPws,varPws,chPws,basincto);
		if(varPwsyas!=0&&e.target.equals(chPwsyas)) FormatDigit(txtPwsyas,varPwsyas,chPwsyas,basincto);
		if(varW!=0&&e.target.equals(chW)) FormatDigit(txtW,varW,chW,nemto);
		if(varWs!=0&&e.target.equals(chWs)) FormatDigit(txtWs,varWs,chWs,nemto);
		if(varWsyas!=0&&e.target.equals(chWsyas)) FormatDigit(txtWsyas,varWsyas,chWsyas,nemto);
		if(varH!=0&&e.target.equals(chH)) FormatDigit(txtH,varH,chH,entalpito);
		if(varT!=0&&e.target.equals(chT)) sicaklikto(chT,txtT,varT);
		if(varTd!=0&&e.target.equals(chTd)) sicaklikto(chTd,txtTd,varTd);
		if(varTyas!=0&&e.target.equals(chTyas)) sicaklikto(chTyas,txtTyas,varTyas);
		if(varRH!=0&&e.target.equals(chRH)) FormatDigit(txtRH,varRH,chRH,RH);
		if(varHeight!=0&&e.target.equals(chHeight)) FormatDigit(txtHeight,varHeight,chHeight,uzunluk);
		if(e.target.equals(MyDigit)){ FormatTextFields();}
	}//Choicelarabasildi
	//
	public void FormatDigit(TextField txt,double d,Choice c,double ar[]){
		//Basamak format� yapar
		DecimalFormat df;
		if(d!=0){
			d=d*ar[c.getSelectedIndex()];
			switch(MyDigit.getSelectedIndex()){
				case 0:
					df=new DecimalFormat("0.#");
					txt.setText(df.format(d));
					break;
				case 1:
					df=new DecimalFormat("0.##");
					txt.setText(df.format(d));
					break;
				case 2:
					df=new DecimalFormat("0.###");
					txt.setText(df.format(d));
					break;
				case 3:
					df=new DecimalFormat("0.####");
					txt.setText(df.format(d));
					break;
        case 4:
					df=new DecimalFormat("0.######");
					txt.setText(df.format(d));
					break;
			}
		}
	}
	//
	public void FormatDigit(TextField txt,double d){
		//Basamak format� yapar
		//Bu hali sadece s�cakl�klar� formatlamak i�in kullan�l�yor.
		DecimalFormat df;
		if(d!=0){
			switch(MyDigit.getSelectedIndex()){
				case 0:
					df=new DecimalFormat("0.#");
					txt.setText(df.format(d));
					break;
				case 1:
					df=new DecimalFormat("0.##");
					txt.setText(df.format(d));
					break;
				case 2:
					df=new DecimalFormat("0.###");
					txt.setText(df.format(d));
					break;
				case 3:
					df=new DecimalFormat("0.####");
					txt.setText(df.format(d));
					break;
        case 4:
					df=new DecimalFormat("0.######");
					txt.setText(df.format(d));
					break;
			}
		}
	}
	//
	public void FormatTextFields(){
		FormatDigit(txtP,varP,chP,basincto);
		FormatDigit(txtPw,varPw,chPw,basincto);
		FormatDigit(txtPws,varPws,chPws,basincto);
		FormatDigit(txtPwsyas,varPwsyas,chPwsyas,basincto);
		FormatDigit(txtW,varW,chW,nemto);
		FormatDigit(txtWs,varWs,chWs,nemto);
		FormatDigit(txtWsyas,varWsyas,chWsyas,nemto);
		FormatDigit(txtH,varH,chH,entalpito);
		FormatDigit(txtRH,varRH,chRH,RH);
		FormatDigit(txtHeight,varHeight,chHeight,uzunluk);
		
	}
	//
	public void sicaklikto(Choice c,TextField t,double d){
		DecimalFormat df;
		String s[]={"0.#","0.##","0.###","0.####","0.######"};
		df=new DecimalFormat(s[1]);
		df=new DecimalFormat(s[MyDigit.getSelectedIndex()]);
		switch(c.getSelectedIndex()){
			case 0:
				t.setText(String.valueOf(df.format(d)));//�C
				break;
			case 1:
				t.setText(String.valueOf(df.format((d*1.8)+32)));//�F
				break;
			case 2:
				t.setText(String.valueOf(df.format(d + 273.15)));
				break;
		}//switch
	}//sicakl�kto sonu
	public double OkuSicaklik(Choice ch,TextField txt){
		double OkuSicaklik=0,d=0;
		d=Double.valueOf(txt.getText()).doubleValue();
		switch(ch.getSelectedIndex()){
		case 0:
			d= d;
			break;
		case 1:
            d = (d -32)/1.8;
			break;
		case 2:
            d=d-273.15 ;
			break;
		}//switch
		OkuSicaklik=d;
		return d;
	}//OkuSicaklik
	public void TyasRhH(){
		//19 nolu kombinasyon	3.4.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		double a,b,c,fark1,DF1,DF2,DD1,DD2,AA,X,Y,varSubT,varSubPws,varSubP;
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH*=1/entalpito[chH.getSelectedIndex()];
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varSubT = varTyas - 1;
		do{
			varSubT = varSubT + 1;
			varSubPws =pf.Pws(varSubT);
			varSubP = ((0.62198 * varRH * varSubPws * (2501 + 1.805 * varSubT))) / (varH - varSubT) + varRH * varSubPws;
			a = (4.186 * varTyas - 2501 - 1.805 * varTyas) * 0.62198 * varPwsyas;
			b = (4.186 * varTyas) * 0.62198 * varRH;
			c = varTyas - varH;
			fark1 = (a / (varSubP - varPwsyas)) - (b * varSubPws / (varSubP - varRH * varSubPws)) - c;
		}while(!(Math.abs(fark1) < 1));
		X = varSubT - 0.5; Y = varSubT + 0.5;
		do{
			AA = (Y - X) / 3;
			DD1 = X + AA; DD2 = Y - AA;
			varSubPws =pf.Pws(DD1);
			varSubP = ((0.62198 * varRH * varSubPws * (2501 + 1.805 * DD1))) / (varH - DD1) + varRH * varSubPws;
			a = (4.186 * varTyas - 2501 - 1.805 * varTyas) * 0.62198 * varPwsyas;
			b = (4.186 * varTyas) * 0.62198 * varRH;
			c = varTyas - varH;
			DF1 = (a / (varSubP - varPwsyas)) - (b * varSubPws / (varSubP - varRH * varSubPws)) - c;
			varSubPws =pf.Pws(DD2);
			varSubP = ((0.62198 * varRH * varSubPws * (2501 + 1.805 * DD2))) / (varH - DD2) + varRH * varSubPws;
			a = (4.186 * varTyas - 2501 - 1.805 * varTyas) * 0.62198 * varPwsyas;
			b = (4.186 * varTyas) * 0.62198 * varRH;
			c = varTyas - varH;
			DF2 = (a / (varSubP - varPwsyas)) - (b * varSubPws / (varSubP - varRH * varSubPws)) - c;
			if(Math.abs(DF1) <Math.abs(DF2)){
				if(DF1<0){X = DD1; Y = DD1 + AA;}
				if(DF1>0){X = DD1 - AA; Y = DD1;}
				if(DF1==0){varSubT = DD2;}
			}else{
				if(DF2<0){X = DD2; Y = DD2 + AA;}
				if(DF2>0){X = DD2 - AA; Y = DD2;}
				if(DF2==0){varSubT = DD1;}
			}
		}while(!(Math.abs(DD1 - DD2) < 0.0000000001));
		varT=DD1;
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(DD1);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varP = ((0.62198 * varRH * varPws * (2501 + 1.805 * DD1))) / (varH - DD1) + varRH * varPws;
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
	}//TyasRhH
	public void TTyasP() throws NumberFormatException{
		//6 nolu kombinasyon	(3.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varPwsyas=pf.Pwsyas(varTyas);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varW=pf.W4(varWsyas,varT,varTyas);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TTyasP
	//
	//
	public void TTyasH(){
		//15 nolu kombinasyon	(3.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varW=pf.W(varH,varT);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas2(varW,varT,varTyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varP=pf.P3(varPwsyas,varWsyas);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TTyasH
	//
	//
	public void TyasTdP(){
		//16 nolu kombinasyon	(3.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varT=pf.T3(varWsyas,varW,varTyas);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TyasTdP
	//
	//
	public void TTyasW(){
		//10 nolu kombinasyon	(3.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas2(varW,varT,varTyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varP=pf.P3(varPwsyas,varWsyas);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TTyasW
	//
	//
	public void TyasWH(){
		//22 nolu kombinasyon	(4.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWsyas=pf.Wsyas2(varW,varT,varTyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varP=pf.P3(varPwsyas,varWsyas);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TyasWH
	//
	//
	public void TyasPH(){
		//24 nolu kombinasyon	(4.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varW=pf.W3(varWsyas,varH,varTyas);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TyasPH
	//
	//
	public void TTyasTd(){
		// 1 nolu kombinasyon	(4.10.1998)
		double A,B,C,D,E,DELTA;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTd=OkuSicaklik(chTd,txtTd);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		A = (2501 + 1.805 * varT - 4.186 * varTyas) * 0.62198 * varPw;
		B = (2.381 * varTyas - 2501) * 0.62198 * varPwsyas;
		C = varTyas - varT;
		D = -(C * varPwsyas + C * varPw + B + A);
		E = C * varPw * varPwsyas + B * varPw + A * varPwsyas;
		DELTA = D * D - 4 * C * E;
		varP = (-D - Math.pow(DELTA,0.5)) / (2 * C);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TTyasTd
	//
	//
	public void TTdP(){
		//2 nolu kombinasyon	(8.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTd=OkuSicaklik(chTd,txtTd);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TTdP()
	//
	//
	public void TWP(){
		//3 nolu kombinasyon	(10.10.1998)
		double varSubWsyas,iter,varSubW4=0,varSubPwsyas=0;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varSubWsyas=0;iter=0;
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TWP()
	//
	//
	public void TyasPW(){
		//17 nolu kombinasyon	(10.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varT=pf.T3(varWsyas,varW,varTyas);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TyasPW()
	//
	//
	public void TyasTdW(){
		//20 nolu kombinasyon	(11.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varTd=OkuSicaklik(chTd,txtTd);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varT=pf.T3(varWsyas,varW,varTyas);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TyasTdW()
	//
	//
	public void TWRH(){
		//4 nolu kombinasyon	(11.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		double varSubPwsyas=0,varSubWsyas=0,varSubW4=0,iter=0;
		varT=OkuSicaklik(chT,txtT);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH=varRH*(1/RH[chRH.getSelectedIndex()]);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TWRH()
	//
	//
	public void TRhH(){
		//5 nolu kombinasyon	(11.10.1998)
		double varSubPwsyas=0,varSubWsyas=0,varSubW=0,iter=0;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH=varRH*(1/RH[chRH.getSelectedIndex()]);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varW=pf.W(varH,varT);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
	}//TRhH()
	//
	//
	public void TTdW(){
		//7 nolu kombinasyon	(11.10.1998)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTd=OkuSicaklik(chTd,txtTd);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
		varRH=pf.RH(varPw,varPws);
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TTdW()
	//
	public void TRhP(){
		// 8 nolu kombinasyon
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH=varRH*RHfrom[chRH.getSelectedIndex()];
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*basinc[chP.getSelectedIndex()];
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TRhP
	//
	public void TdWRh(){
		// 27 nolu kombinasyon	(27.2.1999)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*nem[chW.getSelectedIndex()];
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH=varRH*RHfrom[chRH.getSelectedIndex()];
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varPws=varPw/varRH;
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varT=pf.T(varPws);
		sicaklikto(chT,txtT,varT);
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TdWRh
	//
	public void THP(){
		//12 nolu kombinasyon	(20.3.1999)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP*=basinc[chP.getSelectedIndex()];
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varW=pf.W(varH,varT);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varRH=varPw/varPws;
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//THP
	//
	public void THTd(){
		// 14 nolu kombinasyon	(20.3.1999)
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varTd=OkuSicaklik(chTd,txtTd);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varW=pf.W(varH,varT);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varRH=varPw/varPws;
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//THTd
	//
	public void TdRhH(){
		//28 nolu kombinasyon	27.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH=varRH*(1/RH[chRH.getSelectedIndex()]);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varPws=varPw/varRH;
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varT=pf.T(varPws);
		sicaklikto(chT,txtT,varT);
		varW=pf.W(varH,varT);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
	}//TdRhH
	//
	public void TdPRh(){
		//29 nolu kombinasyon	27.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH=varRH*(1/RH[chRH.getSelectedIndex()]);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*(1/basincto[chP.getSelectedIndex()]);
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varPws=varPw/varRH;
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varT=pf.T(varPws);
		sicaklikto(chT,txtT,varT);
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TdPRh
	//
	public void TdWH(){
		//30 nolu kombinasyon	27.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varRH=varPw/varPws;
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TdWH
	//
	public void TdPH(){
		//31 nolu kombinasyon	27.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*(1/basincto[chP.getSelectedIndex()]);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH=varH*(1/entalpito[chH.getSelectedIndex()]);
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varRH=varPw/varPws;
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TdPH
	//
	public void PWRh(){
		//32 nolu kombinasyon	28.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*(1/basincto[chP.getSelectedIndex()]);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW*=(1/nemto[chW.getSelectedIndex()]);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varPws=varPw/varRH;
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varT=pf.T(varPws);
		sicaklikto(chT,txtT,varT);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//PWRh
	//
	public void PWH(){
		//34 nolu kombinasyon	28.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP=varP*(1/basincto[chP.getSelectedIndex()]);
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW*=(1/nemto[chW.getSelectedIndex()]);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH*=1/entalpito[chH.getSelectedIndex()];
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varRH=varPw/varPws;
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//PWH
	//
	public void WRhH(){
		//35 nolu kombinasyon	28.3.1999
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW*=(1/nemto[chW.getSelectedIndex()]);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH*=1/entalpito[chH.getSelectedIndex()];
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varP=pf.P(varPw,varW);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
	}//WRhH
	//
	public void PRhH(){
		//33 nolu kombinasyon	28.3.1999
		double varSubT,varSubPws,varSubW,varSubH,AA,X,Y,DD1,DD2,DF1,DF2,varSubPw;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH*=1/entalpito[chH.getSelectedIndex()];
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP*=1/basincto[chP.getSelectedIndex()];
		varSubT = 100;
		do{
			varSubT = varSubT - 0.01;
			varSubPw = varRH * pf.Pws(varSubT);
			varSubW = pf.W2(varP, varSubPw);
			varSubH = pf.H(varSubT, varSubW);
		}while(!(Math.abs(varSubH - varH) < 0.1));
		X = varSubT - 0.5; Y = varSubT + 0.5;
		cik:
		do{
			AA = (Y - X) / 3;
			DD1 = X + AA; 
			varSubPw = varRH * pf.Pws(DD1);
			varSubW = pf.W2(varP, varSubPw);
			varSubH = pf.H(DD1, varSubW);
			DF1 = varSubH - varH;
			DD2 = Y - AA;
			varSubPw = varRH * pf.Pws(DD2);
			varSubW = pf.W2(varP, varSubPw);
			varSubH = pf.H(DD2, varSubW);
			DF2 = varSubH - varH;
			if(Math.abs(DF1)<0.0000000001){varT=DD1;break cik;}
			if(Math.abs(DF2)<0.0000000001){varT=DD2;break cik;}
			if(X==Y) {varT=DD1;break cik;}
			if(Math.abs(DF1) <Math.abs(DF2)){
				if(DF1<0){X = DD1; Y = DD1 + AA;}
				if(DF1>0){X = DD1 - AA; Y = DD1;}
				if(DF1==0){varT=DD2;break cik;}
			}else{
				if(DF2<0){X = DD2; Y = DD2 + AA;}
				if(DF2>0){X = DD2 - AA; Y = DD2;}
				if(DF2==0){varT=DD1;break cik;}
			}
		}while(!((Math.abs(DD1 - DD2) < 0.0000000001)||(Math.abs(varSubH-varH)<0.0000000001)));
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varTyas=pf.Tyas1521(varP,varW,varT);
		sicaklikto(chTyas,txtTyas,varTyas);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
	}//PRhH
	//
	public void TTyasRh(){
		//13 nolu kombinasyon	29.3.1999
		double a,b,c,d,e,f,G,h;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varT=OkuSicaklik(chT,txtT);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		a = 0.62198 * varPw;
		b = (2501 - 2.381 * varTyas) * varPwsyas * 0.62198;
		c = varT - varTyas;
		d = 2501 + 1.805 * varT - 4.186 * varTyas;
		e = a * d;
		f = b + c * varPwsyas;
		G = e - f - c * varPw;
		h = -e * varPwsyas + f * varPw;
		varP = pf.IkinciDerecedenDenklem(c, G, h) ;
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TTyasRh
	//
	public void TyasTdRh(){
		//23 nolu kombinasyon	29.3.1999
		double a,b,c,d,e,f,G,h;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varPws=varPw/varRH;
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varT=pf.T(varPws);
		sicaklikto(chT,txtT,varT);
		a = 0.62198 * varPw;
		b = (2501 - 2.381 * varTyas) * varPwsyas * 0.62198;
		c = varT - varTyas;
		d = 2501 + 1.805 * varT - 4.186 * varTyas;
		e = a * d;
		f = b + c * varPwsyas;
		G = e - f - c * varPw;
		h = -e * varPwsyas + f * varPw;
		varP = pf.IkinciDerecedenDenklem(c, G, h);
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TyasTdRh
	//
	public void TyasTdH(){
		//25 nolu kombinasyon	30.3.1999
		double a,b,c,d,e,f,G,h,J,k,delta,x1;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTd=OkuSicaklik(chTd,txtTd);
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varH=Double.valueOf(txtH.getText()).doubleValue();
		varH*=1/entalpito[chH.getSelectedIndex()];
		varPw=pf.Pw(varTd);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		d = 0.62198 * varPwsyas;
		e = (2501 + 1.805 * varTyas) * 0.62198 * varPwsyas;
		f = varTyas - varH;
		G = 4.186 * varTyas;
		h = 0.62198 * varPw;
		J = d * G - e + f * varPwsyas;
		k = h * G;
		a = f;
		b = k - J - f * varPw;
		c = J * varPw - k * varPwsyas;
		delta = b*b - 4 * a * c;
		x1 = (-b - Math.pow(delta,0.5)) / (2 * a);
		varP = x1;
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varT=pf.T2(varH,varW);
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varRH=varPw/varPws;
		txtRH.setText(String.valueOf(varRH*RH[chRH.getSelectedIndex()]));
	}//TyasTdH
	//
	public void TyasRhP(){
		//21 nolu kombinasyon	30.3.1999
		double varSubT,varSubPws,varSubW,varsubTyas,AA,X,Y,DD1,DD2,DF1,DF2;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varP=Double.valueOf(txtP.getText()).doubleValue();
		varP*=1/basincto[chP.getSelectedIndex()];
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varSubT = varTyas+20;
		do{
			varSubT = varSubT - 1;
			varSubPws = pf.Pws(varSubT);
			varSubW = pf.W2(varP, (varRH * varSubPws));
			varsubTyas = pf.Tyas(varWsyas, varSubW, varSubT);
		}while(!(Math.abs(varsubTyas - varTyas) <0.5));
		X = varSubT - 0.5; Y = varSubT + 0.5;
		do{
			AA = (Y - X) / 3;
			DD1 = X + AA; DD2 = Y - AA;
			varSubPws = pf.Pws(DD1);
			varSubW = pf.W2(varP, (varRH * varSubPws));
			varsubTyas = pf.Tyas(varWsyas, varSubW, DD1);
			DF1 = varsubTyas - varTyas;
			varSubPws = pf.Pws(DD2);
			varSubW = pf.W2(varP, (varRH * varSubPws));
			varsubTyas = pf.Tyas(varWsyas, varSubW, DD2);
			DF2 = varsubTyas - varTyas;
			if(Math.abs(DF1) < Math.abs(DF2)){
				if(DF1<0){X = DD1; Y = DD1 + AA;}
				if(DF1>0){X = DD1 - AA; Y = DD1;}
				if(DF1==0){varsubTyas = DD2;}
			}else{
				if(DF2<0){X = DD2; Y = DD2 + AA;}
				if(DF2>0){X = DD2 - AA; Y = DD2;}
				if(DF2==0){varsubTyas = DD1;}
			}
		}while(!((Math.abs(DD1 - DD2) < 0.0000000001)||(Math.abs(varsubTyas - varTyas) < 0.0000000001)));
		varT = DD1;
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varPw=varRH*varPws;
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varW=pf.W2(varP,varPw);
		txtW.setText(String.valueOf(varW*nemto[chW.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TyasRhP
	//
	
	//
	public void TyasWRh(){
		//18 nolu kombinasyon		10.4.1999
		double varSubT,varSubPws,varSubP,varSubW,varsubWsyas,varsubTyas;
		double AA,X,Y,DD1,DD2,DF1,DF2;
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		varTyas=OkuSicaklik(chTyas,txtTyas);
		varRH=Double.valueOf(txtRH.getText()).doubleValue();
		varRH*=1/RH[chRH.getSelectedIndex()];
		varW=Double.valueOf(txtW.getText()).doubleValue();
		varW=varW*(1/(nemto[chW.getSelectedIndex()]));
		varPwsyas=pf.Pwsyas(varTyas);
		txtPwsyas.setText(String.valueOf(varPwsyas*basincto[chPwsyas.getSelectedIndex()]));
		varSubT = varTyas;
		do{
			varSubT = varSubT + 1;
			varSubPws =pf.Pws(varSubT);
			varSubP =pf.P((varSubPws * varRH), varW);
			varSubW = pf.W2(varSubP, (varSubPws * varRH));
			varsubWsyas = pf.Wsyas(varSubP, varPwsyas);
			varsubTyas = pf.Tyas(varsubWsyas, varSubW, varSubT);
		}while(!(Math.abs(varsubTyas - varTyas) < 1));
		X = varSubT - 0.5; Y = varSubT + 0.5;
		do{
			AA = (Y - X) / 3;
			DD1 = X + AA; DD2 = Y - AA;
			varSubPws =pf.Pws(DD1);
			varSubP =pf.P(varSubPws * varRH, varW);
			varSubW =pf.W2(varSubP, varSubPws * varRH);
			varsubWsyas = pf.Wsyas(varSubP, varPwsyas);
			varsubTyas = pf.Tyas(varsubWsyas, varSubW, DD1);
			DF1 = varsubTyas - varTyas;
			varSubPws =pf.Pws(DD2);
			varSubP = pf.P(varSubPws * varRH, varW);
			varSubW = pf.W2(varSubP, varSubPws * varRH);
			varsubWsyas = pf.Wsyas(varSubP, varPwsyas);
			varsubTyas = pf.Tyas(varsubWsyas, varSubW, DD2);
			DF2 = varsubTyas - varTyas;
			if(Math.abs(DF1) < Math.abs(DF2)){
				if(DF1<0){X = DD1; Y = DD1 + AA;}
				if(DF1>0){X = DD1 - AA; Y = DD1;}
				if(DF1==0){varsubTyas = DD2;}
			}else{
				if(DF2<0){X = DD2; Y = DD2 + AA;}
				if(DF2>0){X = DD2 - AA; Y = DD2;}
				if(DF2==0){varsubTyas = DD1;}
			}
		}while(!(Math.abs(DD1 - DD2) < 0.0000000001)||(Math.abs(varsubTyas - varTyas) < 0.0000000001));
		varT = DD1;
		sicaklikto(chT,txtT,varT);
		varPws=pf.Pws(varT);
		txtPws.setText(String.valueOf(varPws*basincto[chPws.getSelectedIndex()]));
		varP=varSubP;
		txtP.setText(String.valueOf(varP*basincto[chP.getSelectedIndex()]));
		varWs=pf.Ws(varP,varPws);
		txtWs.setText(String.valueOf(varWs*nemto[chWs.getSelectedIndex()]));
		varWsyas=pf.Wsyas(varP,varPwsyas);
		txtWsyas.setText(String.valueOf(varWsyas*nemto[chWsyas.getSelectedIndex()]));
		varPw=pf.Pw2(varP,varW);
		txtPw.setText(String.valueOf(varPw*basincto[chPw.getSelectedIndex()]));
		varTd=pf.Td(varPw);
		sicaklikto(chTd,txtTd,varTd);
		varH=pf.H(varT,varW);
		txtH.setText(String.valueOf(varH*entalpito[chH.getSelectedIndex()]));
	}//TyasWRh
	//
	public void FindHeight(TextField TxtGet,TextField TxtSet){
		//Bas�nca kar��l�k gelen y�kseklikleri bulur	15.4.1997
		PsikrometrikFonksiyonlar pf=new PsikrometrikFonksiyonlar();
		int i;
		double PressureRead;
		// Pressure Pascal, height m
		double[] pressure={107478, 101325, 95461, 89874, 79495, 70108, 61640, 54020, 47181, 41061, 35600, 30742, 26436};
		double[] height ={-500, 0, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000};
		PressureRead=Double.valueOf(TxtGet.getText()).doubleValue();
		if (PressureRead!=0) {
			//chP'deki Pa d��� se�imler Pascala �evriliyor
			PressureRead*=1/basincto[chP.getSelectedIndex()];
			i= -1;
			if((PressureRead<=107478)&&(PressureRead>=26436)){
				do{
					i = i + 1;
				}while(!(PressureRead >= pressure[i]));
				varHeight = pf.LR(pressure[i - 1], height[i - 1], pressure[i], height[i], PressureRead); 
				TxtSet.setText(String.valueOf(varHeight*uzunluk[chHeight.getSelectedIndex()]));
				}//if
			else{
				varHeight=0;
				TxtSet.setText("Exceeded");
			}//else
		}//if
	}//FindHeight
}//s�n�f sonu





		