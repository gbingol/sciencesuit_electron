export function FilterNumbers(arr) {
    let retArr = [];
    for (let e of arr) {
        if (isNaN(Number(e)))
            continue;
        retArr.push(parseFloat(e));
    }
    return retArr;
}
