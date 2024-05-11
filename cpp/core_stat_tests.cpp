#include "core_stat_tests.h"
#include "wrapper_funcs.h"

#include <core/math/stat_tests.h>
#include <core/math/stat_regression.h>
#include <iostream>


static core::math::tests::ALTERNATIVE GetAlternative(const std::string& s)
{
    if (s == "two.sided" || s == "notequal")
        return core::math::tests::ALTERNATIVE::TWOSIDED;

    if(s == "greater")
        return core::math::tests::ALTERNATIVE::GREATER;

    return core::math::tests::ALTERNATIVE::LESS;
}


Napi::Value stat_test_z(const Napi::CallbackInfo& info)
{
    //x, sd, mu, alternative="two.sided", conflevel=0.95

    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 5, "Exactly 4 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "x must be array");
    IF_NAPIERR(env, !info[1].IsNumber(), "sigma must be number");
    IF_NAPIERR(env, !info[2].IsNumber(), "mu must be number");
    IF_NAPIERR(env, !info[3].IsString(), "alternative must be string");
    IF_NAPIERR(env, !info[4].IsNumber(), "conflevel must be number");


    auto xvec = toVector(info[0].As<Napi::Array>());
    double sigma = info[1].As<Napi::Number>();
    double mu = info[2].As<Napi::Number>();
    std::string alternative = info[3].As<Napi::String>();
    double conflevel = info[4].As<Napi::Number>();

    try
    {
        auto result = core::math::tests::test_z(xvec, sigma, mu, conflevel, GetAlternative(alternative));
        Napi::Object obj = Napi::Object::New(env);

        obj.Set("pvalue", result.pvalue);
        obj.Set("CI_lower", result.CI_lower);
        obj.Set("CI_upper", result.CI_upper);
        obj.Set("mean", result.mean);
        obj.Set("SE", result.SE);
        obj.Set("stdev", result.stdev);
        obj.Set("N", result.N);
        obj.Set("zcritical", result.zcritical);

        return obj;
    }
    CATCHERR(env);
}


Napi::Value stat_test_f(const Napi::CallbackInfo& info)
{
    //x, y, ratio = 1.0, alternative = "two.sided", conflevel = 0.95

    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 5, "Exactly 5 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "x must be array");
    IF_NAPIERR(env, !info[1].IsArray(), "y must be array");
    IF_NAPIERR(env, !info[2].IsNumber(), "ratio must be number");
    IF_NAPIERR(env, !info[3].IsString(), "alternative must be string");
    IF_NAPIERR(env, !info[4].IsNumber(), "conflevel must be number");


    auto xvec = toVector(info[0].As<Napi::Array>());
    auto yvec = toVector(info[1].As<Napi::Array>());
    double ratio = info[2].As<Napi::Number>();
    std::string alternative = info[3].As<Napi::String>();
    double conflevel = info[4].As<Napi::Number>();

    try
    {
        auto result = core::math::tests::test_f(xvec, yvec, ratio, conflevel, GetAlternative(alternative));
        Napi::Object obj = Napi::Object::New(env);

        obj.Set("pvalue", result.pvalue);
        obj.Set("CI_lower", result.CI_lower);
        obj.Set("CI_upper", result.CI_upper);
        obj.Set("fcritical", result.fcritical);
        obj.Set("df1", result.df1);
        obj.Set("df2", result.df2);
        obj.Set("var1", result.var1);
        obj.Set("var2", result.var2);

        return obj;
    }
    CATCHERR(env);
}



Napi::Value stat_test_t1(const Napi::CallbackInfo& info)
{
    //x, mu, alternative="two.sided", conflevel=0.95

    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 4, "Exactly 4 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "x must be array");
    IF_NAPIERR(env, !info[1].IsNumber(), "mu must be number");
    IF_NAPIERR(env, !info[2].IsString(), "alternative must be string");
    IF_NAPIERR(env, !info[3].IsNumber(), "conflevel must be number");


    auto xvec = toVector(info[0].As<Napi::Array>());
    double mu = info[1].As<Napi::Number>();
    std::string alternative = info[2].As<Napi::String>();
    double conflevel = info[3].As<Napi::Number>();

    try
    {
        auto result = core::math::tests::test_t1(xvec, mu, conflevel, GetAlternative(alternative));
        Napi::Object obj = Napi::Object::New(env);
       
        obj.Set("pvalue", result.pvalue);
        obj.Set("CI_lower", result.CI_lower);
        obj.Set("CI_upper", result.CI_upper);
        obj.Set("mean", result.mean);
        obj.Set("SE", result.SE);
        obj.Set("stdev", result.stdev);
        obj.Set("N", result.N);
        obj.Set("tcritical", result.tcritical);

        return obj;
    }
    CATCHERR(env);
}


Napi::Value stat_test_t2(const Napi::CallbackInfo& info)
{
    //x, y, mu, varequal = True, alternative="two.sided", conflevel=0.95

    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 6, "Exactly 6 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "x must be array");
    IF_NAPIERR(env, !info[1].IsArray(), "y must be array");
    IF_NAPIERR(env, !info[2].IsNumber(), "mu must be number");
    IF_NAPIERR(env, !info[3].IsBoolean(), "varequal must be boolean");
    IF_NAPIERR(env, !info[4].IsString(), "alternative must be string");
    IF_NAPIERR(env, !info[5].IsNumber(), "conflevel must be number");


    auto xvec = toVector(info[0].As<Napi::Array>());
    auto yvec = toVector(info[1].As<Napi::Array>());
    double mu = info[2].As<Napi::Number>();
    bool varequal = info[3].As<Napi::Boolean>();
    std::string alternative = info[4].As<Napi::String>();
    double conflevel = info[5].As<Napi::Number>();

    try
    {
        auto result = core::math::tests::test_t2(xvec, yvec, mu, varequal, conflevel, GetAlternative(alternative));
        Napi::Object obj = Napi::Object::New(env);

        obj.Set("pvalue", result.pvalue);
        obj.Set("CI_lower", result.CI_lower);
        obj.Set("CI_upper", result.CI_upper);
        obj.Set("tcritical", result.tcritical);
        obj.Set("n1", result.n1);
        obj.Set("n2", result.n2);
        obj.Set("df", result.df);
        obj.Set("xaver", result.xaver);
        obj.Set("yaver", result.yaver);
        obj.Set("s1",result.s1);
        obj.Set("s2", result.s2);
        obj.Set("sp", result.sp);

        return obj;
    }
    CATCHERR(env);
}


Napi::Value stat_test_tpaired(const Napi::CallbackInfo& info)
{
    //x, y, mu, alternative="two.sided", conflevel=0.95
    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 5, "Exactly 5 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "x must be array");
    IF_NAPIERR(env, !info[1].IsArray(), "y must be array");
    IF_NAPIERR(env, !info[2].IsNumber(), "mu must be number");
    IF_NAPIERR(env, !info[3].IsString(), "alternative must be string");
    IF_NAPIERR(env, !info[4].IsNumber(), "conflevel must be number");


    auto xvec = toVector(info[0].As<Napi::Array>());
    auto yvec = toVector(info[1].As<Napi::Array>());
    double mu = info[2].As<Napi::Number>();
    std::string alternative = info[3].As<Napi::String>();
    double conflevel = info[4].As<Napi::Number>();

    try
    {
        auto result = core::math::tests::test_tpaired(xvec, yvec, mu, conflevel, GetAlternative(alternative));
        Napi::Object obj = Napi::Object::New(env);

        obj.Set("pvalue", result.pvalue);
        obj.Set("CI_lower", result.CI_lower);
        obj.Set("CI_upper", result.CI_upper);
        obj.Set("tcritical", result.tcritical);
        obj.Set("s1", result.s1);
        obj.Set("s2", result.s2);
        obj.Set("stdev", result.stdev);
        obj.Set("xaver", result.xaver);
        obj.Set("yaver", result.yaver);
        obj.Set("N", result.N);
        obj.Set("mean", result.mean);
        obj.Set("SE", result.SE);

        return obj;
    }
    CATCHERR(env);
}



Napi::Value stat_test_aov2(const Napi::CallbackInfo& info)
{
    //y, x1, x2

    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 3, "Exactly 3 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "Responses must be array");
    IF_NAPIERR(env, !info[1].IsArray(), "x1 (factor) must be array");
    IF_NAPIERR(env, !info[2].IsArray(), "x2 (factor) must be array");

    auto responses = toVector(info[0].As<Napi::Array>());
    auto factor1 = toVector<std::string>(info[1].As<Napi::Array>());
    auto factor2 = toVector<std::string>(info[2].As<Napi::Array>());

   

    try
    {
        auto result = core::math::tests::aov2(responses, factor1, factor2);
        Napi::Object obj = Napi::Object::New(env);

        obj.Set("DFError", result.DFError);
        obj.Set("DFFact1", result.DFFact1);
        obj.Set("DFFact2", result.DFFact2);
        obj.Set("DFinteract", result.DFinteract);

        obj.Set("FvalFact1", result.FvalFact1); 
        obj.Set("FvalFact2", result.FvalFact2); 
        obj.Set("Fvalinteract", result.Fvalinteract);

        obj.Set("MSError", result.MSError); 
        obj.Set("MSFact1", result.MSFact1); 
        obj.Set("MSFact2", result.MSFact2); 
        obj.Set("MSinteract", result.MSinteract);

        obj.Set("pvalFact1", result.pvalFact1); 
        obj.Set("pvalFact2", result.pvalFact2); 
        obj.Set("pvalinteract", result.pvalinteract);

        obj.Set("SSError", result.SSError); 
        obj.Set("SSFact1", result.SSFact1); 
        obj.Set("SSFact2", result.SSFact2); 
        obj.Set("SSinteract", result.SSinteract);

        obj.Set("Fits", toNapiArray(env, result.Fits));
        obj.Set("residuals", toNapiArray(env, result.Residuals));

        return obj;
    }
    CATCHERR(env);
}



Napi::Value stat_regression_simplelinear(const Napi::CallbackInfo& info)
{
    //yobs, factor, Intercept = true, conflevel = 0.95
    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 4, "Exactly 4 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "Observations must be array");
    IF_NAPIERR(env, !info[1].IsArray(), "Factor must be array");
    IF_NAPIERR(env, !info[2].IsBoolean(), "Intercept must be number");
    IF_NAPIERR(env, !info[3].IsNumber(), "conflevel must be number");


    auto observation = toVector(info[0].As<Napi::Array>());
    auto factor = toVector(info[1].As<Napi::Array>());
    bool Intercept = info[2].As<Napi::Boolean>();
    double conflevel = info[3].As<Napi::Number>();

#define SET(obj, param)\
    obj.Set(#param, result.param)

    try
    {
        auto SLR = core::math::regression::SimpleLinearRegression(observation, factor, Intercept, conflevel);
        auto result = SLR.Compute();

        Napi::Object obj = Napi::Object::New(env);

        SET(obj, pvalue);
        SET(obj, DF_Residual);
        SET(obj, DF_Regression);
        SET(obj, SS_Residual);
        SET(obj, MS_Residual);
        SET(obj, SS_Regression);
        SET(obj, MS_Regression);
        SET(obj, SS_Total);
        SET(obj, Fvalue);
        SET(obj, R2);
        SET(obj, SE);

        auto CoeffStat = result.CoefStats;
        auto arr = Napi::Array::New(env, CoeffStat.size());
        size_t i = 0; 
        for (const auto& st : CoeffStat)
        {
            Napi::Object statobj = Napi::Object::New(env);
            statobj.Set("pvalue", st.pvalue);
            statobj.Set("Coefficient", st.Coeff);
            statobj.Set("tvalue", st.tvalue);
            statobj.Set("SE", st.SE);
            statobj.Set("CILow", st.CILow);
            statobj.Set("CIHigh", st.CIHigh);

            arr.Set(i++, statobj);
        }

        obj.Set("CoeffStats", arr);

        return obj;
    }
    CATCHERR(env);
}



Napi::Value stat_regression_multiplelinear(const Napi::CallbackInfo& info)
{
    //yobs, factor, Intercept = true, conflevel = 0.95
    Napi::Env env = info.Env();
    IF_NAPIERR(env, info.Length() != 4, "Exactly 4 parameters required.");
    IF_NAPIERR(env, !info[0].IsArray(), "Observations must be array");
    IF_NAPIERR(env, !info[1].IsArray(), "Factor must be array");
    IF_NAPIERR(env, !info[2].IsBoolean(), "Intercept must be number");
    IF_NAPIERR(env, !info[3].IsNumber(), "conflevel must be number");


    auto observation = toVector(info[0].As<Napi::Array>());
    auto factor = to2DVector(info[1].As<Napi::Array>());
    bool Intercept = info[2].As<Napi::Boolean>();
    double conflevel = info[3].As<Napi::Number>();

#define SET(obj, param)\
    obj.Set(#param, result.param)

    try
    {
        auto MLR = core::math::regression::MultipleLinearRegression(observation, factor, Intercept, conflevel);
        auto result = MLR.Compute();

        Napi::Object obj = Napi::Object::New(env);

        SET(obj, pvalue);
        SET(obj, DF_Residual);
        SET(obj, DF_Regression);
        SET(obj, SS_Residual);
        SET(obj, MS_Residual);
        SET(obj, SS_Regression);
        SET(obj, MS_Regression);
        SET(obj, SS_Total);
        SET(obj, Fvalue);
        SET(obj, R2);

        auto CoeffStat = result.CoefStats;
        auto arr = Napi::Array::New(env, CoeffStat.size());
        size_t i = 0;
        for (const auto& st : CoeffStat)
        {
            Napi::Object statobj = Napi::Object::New(env);
            statobj.Set("pvalue", st.pvalue);
            statobj.Set("Coefficient", st.Coeff);
            statobj.Set("tvalue", st.tvalue);
            statobj.Set("SE", st.SE);
            statobj.Set("CILow", st.CILow);
            statobj.Set("CIHigh", st.CIHigh);

            arr.Set(i++, statobj);
        }

        obj.Set("CoeffStats", arr);

        return obj;
    }
    CATCHERR(env);
}
