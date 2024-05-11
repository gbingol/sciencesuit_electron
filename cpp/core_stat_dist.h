#pragma once
#include <napi.h>
#include <core/math/stat_dist.h>

Napi::Value dist_pf(const Napi::CallbackInfo& info);

Napi::Value dist_dnorm(const Napi::CallbackInfo& info);