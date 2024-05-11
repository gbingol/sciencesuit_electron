#include "wrapper_funcs.h"


Napi::Array toNapiArray(const Napi::Env& env, const std::vector<double>& v)
{
    auto arr = Napi::Array::New(env, v.size());

    size_t i = 0;
    for (const auto& elem : v)
        arr.Set(i++, Napi::Number::New(env, elem));

    return arr;
}

std::vector<double> toVector(const Napi::Array& arr)
{
    std::vector<double> v;
    for (size_t i = 0; i < arr.Length(); i++)
    {
        Napi::Value k = arr[i];

        if (k.IsNumber())
            v.push_back(k.As<Napi::Number>());
    }

    return v;
}

std::vector<std::string> toStringVector(const Napi::Array& arr)
{
    std::vector<std::string> v;
    for (size_t i = 0; i < arr.Length(); i++)
    {
        Napi::Value k = arr[i];

        if (k.IsString())
            v.push_back(k.As<Napi::String>());

    }

    return v;
}