#include <iostream>
#include <vector>
#include <string>
#include <emscripten/bind.h>

#include "psychrometry.h"

using namespace emscripten;



std::string to_str(
	const std::vector<std::string>& Keys,
	const std::vector<double>& Vals)
{
	Psychrometry psy;
	psy.Compute(Keys, Vals);

	return psy.to_str();
}


std::string to_json(
	const std::vector<std::string>& Keys,
	const std::vector<double>& Vals)
{
	Psychrometry psy;
	psy.Compute(Keys, Vals);

	return psy.to_json();
}


EMSCRIPTEN_BINDINGS(my_module) 
{
	register_vector<double>("VectorDouble");
	register_vector<std::string>("VectorString");
	function("to_str", &to_str);
	function("to_json", &to_json);
}
