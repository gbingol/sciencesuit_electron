#include "core_eng.h"

#include <core/eng/psychrometry.h>

Napi::Value psychrometry(const Napi::CallbackInfo& info)
{
    Napi::Env env = info.Env();
    if (info.Length() != 2)
    {
        Napi::TypeError::New(env, "Exactly 2 parameters required.").ThrowAsJavaScriptException();
        return env.Null();
    }

    auto Keys = info[0].As<Napi::Array>();
    auto Values = info[1].As<Napi::Array>();

    core::eng::Psychrometry psy;

    std::vector<std::string> K;
    std::vector<double> V;
    for (size_t i = 0; i < Keys.Length(); i++)
    {
        Napi::Value k = Keys[i];
        Napi::Value v = Values[i];
        if (k.IsString())
            K.push_back(k.As<Napi::String>());

        if (v.IsNumber())
            V.push_back((double)v.As<Napi::Number>());
    }

    if (K.size() != 3)
    {
        Napi::Error::New(env, "First array must have exactly 3 entries").ThrowAsJavaScriptException();
        return env.Null();
    }

    if (K.size() != V.size())
    {
        Napi::Error::New(env, "First and 2nd arrays must have same lengths").ThrowAsJavaScriptException();
        return env.Null();
    }

    try
    {
        psy.Compute(K, V);

        Napi::Object obj = Napi::Object::New(env);
        obj.Set("p", psy.getP() / 1000);
        obj.Set("tdb", psy.getTdb());
        obj.Set("twb", psy.getTwb());
        obj.Set("tdp", psy.getTdp());
        obj.Set("h", psy.getH());
        obj.Set("rh", psy.getRH());
        obj.Set("w", psy.getW());
        obj.Set("v", psy.getV());

        obj.Set("pw", psy.getPw() / 1000);
        obj.Set("pws", psy.getPws() / 1000);
        obj.Set("ws", psy.getWs());

        return obj;
    }
    catch (std::exception& e)
    {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }

}