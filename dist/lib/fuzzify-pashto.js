"use strict";
/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Arabic punctuation to exclude
// ، \u060c ؟ \u061f ؛ \u061b ۔ \u06d4
// Digits etc. exclude \u0660 - \u066f
var pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
// ISSUE: This does not work if the word is starting with a non-Pashto character like " or « or .
// I don't know how to solve this without lookbehinds in JavaScript (not available on all platforms)
// Need to try all these ideas: https://stackoverflow.com/questions/641407/javascript-negative-lookbehind-equivalent
var pashtoWordBoundaryBeginning = "(^|[^" + pashtoCharacterRange + "])";
// TODO: Deal with diacritics etc.
// .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');
// TOOD: handle "" input
// TODO: add southern ش س (at beginning of word?)
var sSounds = "صسثڅ";
var zSounds = "زضظذځژ";
var tdSounds = "طتټدډ";
var velarPlosives = "ګږکقگك";
var rLikeSounds = "رړڑڼ";
var labialPlosivesAndFricatives = "فپب";
// Includes Arabic ى \u0649  
var theFiveYeys = "ېۍیيئےى";
var pashtoReplacer = {
    "ا": "اآهع",
    "آ": "اآه",
    "ٱ": "اآه",
    "ٲ": "اآه",
    "ٳ": "اآه",
    "ی": theFiveYeys,
    "ي": theFiveYeys,
    "ې": theFiveYeys,
    "ۍ": theFiveYeys,
    "ئ": theFiveYeys,
    "ے": theFiveYeys,
    "س": sSounds,
    "ص": sSounds,
    "ث": sSounds,
    "څ": sSounds,
    "ج": "چجڅ",
    "چ": "چجڅ",
    "ه": "اهحہ",
    "ۀ": "اهحہ",
    "ہ": "اهحہ",
    "ع": "اوع",
    "و": "وع",
    "ؤ": "وع",
    "ښ": "ښخشخهحغ",
    "غ": 'ښخشخهحغ',
    "خ": 'ښخشخهحغ',
    "ح": 'ښخشخهحغ',
    "ش": 'شښ',
    "ز": zSounds,
    "ض": zSounds,
    "ذ": zSounds,
    "ځ": zSounds,
    "ظ": zSounds,
    "ژ": 'زضظژذځږ',
    "ر": rLikeSounds,
    "ړ": rLikeSounds,
    "ڑ": rLikeSounds,
    "ت": tdSounds,
    "ټ": tdSounds,
    "ٹ": tdSounds,
    "ط": tdSounds,
    "د": tdSounds,
    "ډ": tdSounds,
    "ڈ": tdSounds,
    "نب": 'نبم',
    "ن": 'نڼ',
    "ڼ": 'نڼړڑ',
    "ک": velarPlosives,
    "ګ": velarPlosives,
    "گ": velarPlosives,
    "ق": velarPlosives,
    "ږ": velarPlosives + 'ژ',
    "ب": labialPlosivesAndFricatives,
    "پ": labialPlosivesAndFricatives,
    "ف": labialPlosivesAndFricatives,
};
var thingsToReplace = Object.keys(pashtoReplacer);
var pashtoReplacerRegex = new RegExp(thingsToReplace.reduce(function (accumulator, currentValue, i) {
    if (i === thingsToReplace.length - 1) {
        return accumulator + currentValue;
    }
    return accumulator + currentValue + "|";
}, ""), "g");
function fuzzifyPashto(input, options) {
    if (options === void 0) { options = {}; }
    var safeInput = input.replace(/[#-.]|[[-^]|[?|{}]/g, '');
    if (options.allowSpacesInWords) {
        safeInput = safeInput.replace(/ /g, '');
    }
    var regexLogic = safeInput.trim().replace(pashtoReplacerRegex, function (mtch) {
        return "[" + pashtoReplacer[mtch] + "]" + (options.allowSpacesInWords ? '\ ?' : '');
    });
    // Set how to begin the matching (default at the beginning of a word)
    var beginning = options.matchStart === "string" ? "^" :
        options.matchStart === "anywhere" ? "" :
            pashtoWordBoundaryBeginning; // "word" is the default
    var ending = "";
    if (options.matchWholeWordOnly) {
        if (options.matchStart === "anywhere")
            beginning = pashtoWordBoundaryBeginning;
        ending = "(?![" + pashtoCharacterRange + "])";
    }
    // If they're already using matchWholeWordOnly, don't change it
    if (options.returnWholeWord && !options.matchWholeWordOnly) {
        ending = "[" + pashtoCharacterRange + "]*(?![" + pashtoCharacterRange + "])";
        if (options.matchStart === "anywhere") {
            beginning = pashtoWordBoundaryBeginning + "[" + pashtoCharacterRange + "]*";
        }
    }
    var flags = "m" + (options.globalMatch === false ? '' : 'g');
    return new RegExp("" + beginning + regexLogic + ending, flags);
}
exports.fuzzifyPashto = fuzzifyPashto;
//# sourceMappingURL=fuzzify-pashto.js.map