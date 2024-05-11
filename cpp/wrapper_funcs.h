#pragma once

#include <napi.h>
#include <vector>


Napi::Array toNapiArray(const Napi::Env& env, const std::vector<double>& v);




template <typename T = double>
std::vector<T> toVector(const Napi::Array& arr)
{
    std::vector<T> v;
    for (size_t i = 0; i < arr.Length(); i++)
    {
        Napi::Value k = arr[i];
        if constexpr (std::is_floating_point_v<T> || std::is_integral_v<T>)
        {
            if (k.IsNumber())
                v.push_back(k.As<Napi::Number>());
        }
        else
        {
            if (k.IsString())
                v.push_back(k.As<Napi::String>());
        }
    }

    return v;
}


template <typename T = double>
std::vector<std::vector<T>> to2DVector(const Napi::Array& arr)
{
    std::vector<std::vector<T>> v;
    for (size_t i = 0; i < arr.Length(); i++)
    {
        Napi::Value k = arr[i];
        if (!k.IsArray())
            throw std::runtime_error("Array is not 2D");

        v.push_back(toVector<T>(k.As<Napi::Array>()));
    }

    return v;
}


#define IF_NAPIERR(env, cond, msg) \
    if (cond){ \
        Napi::TypeError::New(env, msg).ThrowAsJavaScriptException();\
        return env.Null(); \
    }

#define CATCHERR(env) \
    catch (const std::exception& e) { \
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException(); \
        return env.Null(); \
    }