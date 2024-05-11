#include <napi.h>

#include "core_eng.h"
#include "core_stat_dist.h"
#include "core_stat_tests.h"



Napi::Object Init(Napi::Env env, Napi::Object exports) 
{
    exports.Set(Napi::String::New(env, "psy"), Napi::Function::New(env, psychrometry));

    //distributions
    exports.Set(Napi::String::New(env, "dist_pf"), Napi::Function::New(env, dist_pf));
    exports.Set(Napi::String::New(env, "dist_dnorm"), Napi::Function::New(env, dist_dnorm));

    //statistical tests
    exports.Set(Napi::String::New(env, "test_z"), Napi::Function::New(env, stat_test_z));
    exports.Set(Napi::String::New(env, "test_f"), Napi::Function::New(env, stat_test_f));
    exports.Set(Napi::String::New(env, "test_t1"), Napi::Function::New(env, stat_test_t1));
    exports.Set(Napi::String::New(env, "test_t2"), Napi::Function::New(env, stat_test_t2));
    exports.Set(Napi::String::New(env, "test_tpaired"), Napi::Function::New(env, stat_test_tpaired));

    //ANOVA
    exports.Set(Napi::String::New(env, "test_aov2"), Napi::Function::New(env, stat_test_aov2));

    //REGRESSION
    exports.Set(Napi::String::New(env, "regression_simplelinear"), Napi::Function::New(env, stat_regression_simplelinear));
    exports.Set(Napi::String::New(env, "regression_multiplelinear"), Napi::Function::New(env, stat_regression_multiplelinear));

    return exports;
}

NODE_API_MODULE(nodebind, Init)
