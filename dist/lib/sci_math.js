export function sum(arr) {
    if (arr.length == 0)
        return 0.0;
    return arr.reduce((acc, e) => acc + e, 0);
}
export function mean(arr) {
    if (arr.length == 0)
        throw new Error("Array does not contain any elements!");
    return sum(arr) / arr.length;
}
export function variance(vector, ddof) {
    let sum_X = 0;
    let sum_X2 = 0;
    let N = vector.length;
    if (N < 3)
        throw new Error("Array must have at least 3 elements");
    if (ddof >= N)
        throw new Error("ddof must be smaller than len");
    for (let Num of vector) {
        sum_X += Num;
        sum_X2 += Num * Num;
    }
    let E_X = sum_X / N, E_X2 = sum_X2 / N;
    let varPop = E_X2 - E_X * E_X; //Population
    let df_Population = N;
    let df_Sample = df_Population - 1;
    return varPop * df_Population / (N - ddof);
}
export function stdev(v, ddof) {
    let N = v.length;
    if (N < 3)
        throw new Error("At least 3 elements expected");
    if (ddof >= N)
        throw new Error("ddof must be smaller than len");
    return Math.pow(variance(v, ddof), 0.5);
}
export function round(num, digits) {
    if (Number.isInteger(num))
        return num;
    return num.toFixed(digits);
}
export function lerp(x, y, a) {
    /*
    lerp(20, 80, 0)   // 20
    lerp(20, 80, 1)   // 80
    lerp(20, 80, 0.5) // 50
    */
    return x * (1 - a) + y * a;
}
/*
    clamp(24, 20, 30) // 24
    clamp(12, 20, 30) // 20
    clamp(32, 20, 30) // 30
*/
export function clamp(a, min = 0, max = 1) {
    return Math.min(max, Math.max(min, a));
}
export function invlerp(x, y, a) {
    /*
    invlerp(50, 100, 75)  // 0.5
    invlerp(50, 100, 25)  // 0
    invlerp(50, 100, 125) // 1
    */
    return clamp((a - x) / (y - x));
}
export function linearinterp(x1, y1, x2, y2, xval) {
    //linear interpolation
    if (x1 == x2)
        return y1;
    let m = 0, n = 0;
    m = (y2 - y1) / (x2 - x1);
    n = y2 - m * x2;
    return m * xval + n;
}
export function cumsum(arr) {
    let sum = 0;
    return arr.map(e => sum += e);
}
export function diff(arr) {
    if (arr.length < 2)
        throw new Error("Array must have at least 2 elements");
    let x = [];
    for (let i = 1; i < arr.length; ++i)
        x.push(arr[i] - arr[i - 1]);
    return x;
}
/*******************  SIMPLE ARRAY OPERATIONS ************************/
export function add(x, y) {
    if (!(Array.isArray(x) || Array.isArray(y)))
        throw new Error("x and/or y must be array");
    let _x;
    let val;
    if (Array.isArray(x) && Array.isArray(y)) {
        let _x = Array.from(x);
        if (x.length != y.length)
            throw new Error("Array lengths must be same");
        for (let i = 0; i < _x.length; ++i)
            _x[i] += y[i];
        return _x;
    }
    else if (Array.isArray(x) && !Array.isArray(y)) {
        _x = Array.from(x);
        val = y;
        for (let i = 0; i < _x.length; ++i)
            _x[i] += val;
        return _x;
    }
    else if (Array.isArray(y) && !Array.isArray(x)) {
        _x = Array.from(y);
        val = x;
        for (let i = 0; i < _x.length; ++i)
            _x[i] += val;
        return _x;
    }
    else
        throw new Error("Unexpected input");
}
export function sub(x, y) {
    // x - y = x + (-y)
    return add(x, Array.isArray(y) ? y.map(e => -e) : -y);
}
export function mul(x, y) {
    if (!(Array.isArray(x) || Array.isArray(y)))
        throw new Error("x and/or y must be array");
    let _x;
    let val;
    if (Array.isArray(x) && Array.isArray(y)) {
        let _x = Array.from(x);
        if (x.length != y.length)
            throw new Error("Array lengths must be same");
        for (let i = 0; i < _x.length; ++i)
            _x[i] *= y[i];
        return _x;
    }
    else if (Array.isArray(x) && !Array.isArray(y)) {
        _x = Array.from(x);
        val = y;
        for (let i = 0; i < _x.length; ++i)
            _x[i] *= val;
        return _x;
    }
    else if (Array.isArray(y) && !Array.isArray(x)) {
        _x = Array.from(y);
        val = x;
        for (let i = 0; i < _x.length; ++i)
            _x[i] *= val;
        return _x;
    }
    else
        throw new Error("Unexpected input");
}
export function div(x, y) {
    // x/y = x* (1/y)
    return mul(x, Array.isArray(y) ? y.map(e => 1.0 / e) : 1.0 / y);
}
export function pow(x, y) {
    if (!(Array.isArray(x) || Array.isArray(y)))
        throw new Error("x and/or y must be array");
    let _x = [];
    if (Array.isArray(x) && Array.isArray(y)) {
        if (x.length != y.length)
            throw new Error("Array lengths must be same");
        for (let i = 0; i < _x.length; ++i)
            _x[i] = Math.pow(x[i], y[i]);
    }
    else if (typeof x === "number" && Array.isArray(y)) {
        for (let i = 0; i < y.length; ++i)
            _x[i] = Math.pow(x, y[i]);
    }
    else if (typeof y === "number" && Array.isArray(x)) {
        for (let i = 0; i < x.length; ++i)
            _x[i] = Math.pow(x[i], y);
    }
    return _x;
}
