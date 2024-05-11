#pragma once
#include <napi.h>
#include <core/math/stat_tests.h>

//z-test
Napi::Value stat_test_z(const Napi::CallbackInfo& info);

//f-test
Napi::Value stat_test_f(const Napi::CallbackInfo& info);

//1 sample t-test
Napi::Value stat_test_t1(const Napi::CallbackInfo& info);

//2 sample t-test
Napi::Value stat_test_t2(const Napi::CallbackInfo& info);

//2 sample t-test
Napi::Value stat_test_tpaired(const Napi::CallbackInfo& info);

//Two-factor ANOVA
Napi::Value stat_test_aov2(const Napi::CallbackInfo& info);

//Simple Linear Regression
Napi::Value stat_regression_simplelinear(const Napi::CallbackInfo& info);

//Multiple Linear Regression
Napi::Value stat_regression_multiplelinear(const Napi::CallbackInfo& info);


