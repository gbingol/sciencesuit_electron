//Only returns entries that can be converted to number (uses parseFloat)
export function FilterNumbers(arr) {
    let retArr = [];
    for (let e of arr) {
        if (isNaN(Number(e)))
            continue;
        retArr.push(parseFloat(e));
    }
    return retArr;
}
//All types can be converted to string!
export function ToStringArray(arr) {
    return arr.map(e => String(e));
}
export function polyval(x, Coeffs) {
    /*
    Given the coefficients of a polynomial in a0 + a1*x + a2*x^2 + ...
    evaluates x
    */
    let sum = 0;
    for (let i = 0; i < Coeffs.length; i++) {
        sum += Coeffs[i] * Math.pow(x, i);
    }
    return sum;
}
