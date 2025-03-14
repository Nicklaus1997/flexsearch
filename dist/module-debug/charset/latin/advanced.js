import { EncoderOptions } from "../../type.js";
import { soundex } from "./balance.js";

export const matcher = new Map([
//["ai", "ei"], // before soundex
["ae", "a"], ["oe", "o"],
//["ue", "u"], // soundex map
["sh", "s"], // replacer "h"
//["ch", "c"], // before soundex
["kh", "k"], // after soundex
["th", "t"], // replacer "h"
//["ph", "f"],
["pf", "f"]]);

export const replacer = [/([^aeo])h(.)/g, "$1$2", /([aeo])h([^aeo]|$)/g, "$1$2", /([^0-9])\1+/g, "$1"];

/** @type EncoderOptions */
const options = {
    normalize: !0,
    dedupe: !0,
    mapper: soundex,
    matcher: matcher,
    replacer: replacer
};
export default options;