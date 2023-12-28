import * as stat from '../globaltypes.js';
export function GetAlternative(s) {
    if (s === "two.sided" || s === "notequal")
        return stat.Alternative.TWOSIDED;
    if (s === "greater")
        return stat.Alternative.GREATER;
    return stat.Alternative.LESS;
}
