from scisuit.eng.humidair import psychrometry, PsychrometryResult
import sys

if __name__ == "__main__":
	#data comes as P|101.325|Tdb|20|Twb|10
	l = sys.argv[1].split("|")
	assert len(l) == 6, "Exactly 3 selections must be made"