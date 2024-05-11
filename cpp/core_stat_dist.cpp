#include "core_stat_dist.h"
#include "wrapper_funcs.h"

using namespace core::math;

Napi::Value dist_pf(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    IF_NAPIERR(env, info.Length() != 3, "Exactly 3 parameters required.");
    IF_NAPIERR(env, !(info[0].IsNumber() || info[0].IsArray()), "First arg must be number or array.");
    IF_NAPIERR(env, !info[1].IsNumber(), "df1 must be number.");
    IF_NAPIERR(env, !info[2].IsNumber(), "df2 must be number.");

    int df1 = info[1].As<Napi::Number>();
    int df2 = info[2].As<Napi::Number>();

    try
    {
        if (info[0].IsNumber())
        {
            double xval = info[0].As<Napi::Number>();
            return Napi::Number::New(env, dist::pf(xval, df1, df2));
        }

       const auto Vec = toVector(info[0].As<Napi::Array>());
       return toNapiArray(env, dist::pf(Vec, df1, df2));
    }
    CATCHERR(env);
}


Napi::Value dist_dnorm(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    
    IF_NAPIERR(env, info.Length() != 3, "Exactly 3 parameters required.");
    IF_NAPIERR(env, !(info[0].IsNumber() || info[0].IsArray()), "First arg must be number or array.");
    IF_NAPIERR(env, !info[1].IsNumber(), "mean must be number.");
    IF_NAPIERR(env, !info[2].IsNumber(), "sd must be number.");

    double mean = info[1].As<Napi::Number>();
    double sd = info[2].As<Napi::Number>();

    try
    {
        if (info[0].IsNumber())
        {
            double xval = info[0].As<Napi::Number>();
            return Napi::Number::New(env, dist::dnorm(xval, mean, sd));
        }

        const auto Vec = toVector(info[0].As<Napi::Array>());
        return toNapiArray(env, dist::dnorm(Vec, mean, sd));
    }
    CATCHERR(env);
}