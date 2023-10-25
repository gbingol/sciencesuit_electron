#include <iostream>
#include <vector>
#include <string>
#include <emscripten/bind.h>

#include "psychrometry.h"

using namespace emscripten;

std::vector<double> addVectors(const std::vector<double>& vector1, const std::vector<double>& vector2) {
    if (vector1.size() != vector2.size()) 
        throw std::runtime_error("Vector sizes must be the same");

    std::vector<double> result(vector1.size());

    for (size_t i = 0; i < vector1.size(); ++i) {
        result[i] = vector1[i] + vector2[i];
    }

    return result;
}

std::string sayhello()
{
    std::vector<std::string> Keys;
    Keys.push_back("p");
    Keys.push_back("tdb");
    Keys.push_back("twb");

    std::vector<double> Vals;
    Vals.push_back(101325);
    Vals.push_back(30);
    Vals.push_back(15);

    Psychrometry psy;
    psy.Compute(Keys, Vals);

    return psy.to_str();
}


EMSCRIPTEN_BINDINGS(my_module) 
{
    register_vector<double>("VectorDouble");
    function("addVectors", &addVectors);
    function("sayhello", &sayhello);
}
