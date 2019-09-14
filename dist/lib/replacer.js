"use strict";
/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: add southern ش س (at beginning of word?)
var sSounds = "صسثڅ";
var zSounds = "زضظذځژ";
var tdSounds = "طتټدډ";
var velarPlosives = "ګږکقگك";
var rLikeSounds = "رړڑڼ";
var labialPlosivesAndFricatives = "فپب";
// Includes Arabic ى \u0649  
var theFiveYeys = "ېۍیيئےى";
var guttural = "ښخشخهحغ";
var pashtoReplacerInfo = {
    "اً": { range: "ان" },
    "ا": { range: "اآهع", plus: ["اً"] },
    "آ": { range: "اآه" },
    "ٱ": { range: "اآه" },
    "ٲ": { range: "اآه" },
    "ٳ": { range: "اآه" },
    "ی": { range: theFiveYeys },
    "ي": { range: theFiveYeys },
    "ې": { range: theFiveYeys },
    "ۍ": { range: theFiveYeys },
    "ئ": { range: theFiveYeys },
    "ے": { range: theFiveYeys },
    "س": { range: sSounds },
    "ص": { range: sSounds },
    "ث": { range: sSounds },
    "څ": { range: sSounds + "چ" },
    "ج": { range: "چجڅځژ" },
    "چ": { range: "چجڅځ" },
    "ه": { range: "اهحہ" },
    "ۀ": { range: "اهحہ" },
    "ہ": { range: "اهحہ" },
    "ع": { range: "اوع", ignorable: true },
    "و": { range: "وع", ignorable: true },
    "ؤ": { range: "وع" },
    "ښ": { range: guttural },
    "غ": { range: guttural },
    "خ": { range: guttural },
    "ح": { range: guttural },
    "ش": { range: "شښ" },
    "ز": { range: zSounds },
    "ض": { range: zSounds },
    "ذ": { range: zSounds },
    "ځ": { range: zSounds + "جڅ" },
    "ظ": { range: zSounds },
    "ژ": { range: "زضظژذځږج" },
    "ر": { range: rLikeSounds },
    "ړ": { range: rLikeSounds },
    "ڑ": { range: rLikeSounds },
    "ت": { range: tdSounds },
    "ټ": { range: tdSounds },
    "ٹ": { range: tdSounds },
    "ط": { range: tdSounds },
    "د": { range: tdSounds },
    "ډ": { range: tdSounds },
    "ڈ": { range: tdSounds },
    "نب": { range: "نبم" },
    "ن": { range: "نڼ", plus: ["اً"] },
    "ڼ": { range: "نڼړڑ" },
    "ک": { range: velarPlosives },
    "ګ": { range: velarPlosives },
    "گ": { range: velarPlosives },
    "ق": { range: velarPlosives },
    "ږ": { range: velarPlosives + "ژ" },
    "ب": { range: labialPlosivesAndFricatives },
    "پ": { range: labialPlosivesAndFricatives },
    "ف": { range: labialPlosivesAndFricatives },
};
exports.pashtoReplacerInfo = pashtoReplacerInfo;
var pashtoReplacerRegex = new RegExp(Object.keys(pashtoReplacerInfo).join("|"), "g");
exports.pashtoReplacerRegex = pashtoReplacerRegex;
//# sourceMappingURL=replacer.js.map