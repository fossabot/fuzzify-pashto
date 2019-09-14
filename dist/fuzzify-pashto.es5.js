/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
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
var pashtoReplacerRegex = new RegExp(Object.keys(pashtoReplacerInfo).join("|"), "g");

/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
// Unfortunately, without ES2018 lookbehind assertions word boundary matching is not as clean
// Without lookbehind assertions, we are unable to ignore punctuation directly in front of a word
// and matching results include a space before the word
var pashtoWordBoundaryBeginning = "(?:^|[^" + pashtoCharacterRange + "])";
// These problems are solved by using the ES2018 lookbehind assertions where environments permit
var pashtoWordBoundaryBeginningWithES2018 = "(?<![" + pashtoCharacterRange + "])";
var diacritics = "\u064b-\u065f\u0670\u0674"; // pretty generous diactritic range
function sanitizeInput(input, options) {
    var safeInput = input.trim().replace(/[#-.]|[[-^]|[?|{}]/g, "");
    if (options.allowSpacesInWords) {
        safeInput = safeInput.replace(/ /g, "");
    }
    if (options.ignoreDiacritics) {
        safeInput = safeInput.replace(new RegExp("[" + diacritics + "]", "g"), "");
    }
    return safeInput;
}
function prepareMainRegexLogic(sanitizedInput, options) {
    return sanitizedInput.replace(pashtoReplacerRegex, function (mtch) {
        var r = pashtoReplacerInfo[mtch];
        var range = "[" + r.range + "]";
        if (r.plus) {
            var additionalOptionGroups = r.plus.reduce(function (t, o) {
                return t + o + "|";
            }, "");
            range = "(" + additionalOptionGroups + range + ")";
        }
        return "" + range + (r.ignorable ? "?" : "") + "\u0639?" + (options.ignoreDiacritics ? "[" + diacritics + "]?" : "") + (options.allowSpacesInWords ? "\ ?" : "");
    });
}
function getBeginningWithAnywhere(options) {
    // Override the "anywhere" when matchWholeWordOnly is true
    if (options.matchWholeWordOnly) {
        return pashtoWordBoundaryBeginning;
    }
    if (options.returnWholeWord) {
        // Return the whole world even if matching from the middle (if desired)
        return pashtoWordBoundaryBeginning + "[" + pashtoCharacterRange + "]*";
    }
    return "";
}
function prepareBeginning(options) {
    // options.matchStart can be "string", "anywhere", or "word" (default)
    if (options.matchStart === "string") {
        return "^";
    }
    if (options.matchStart === "anywhere") {
        return getBeginningWithAnywhere(options);
    }
    // options.matchStart default "word"
    // return the beginning word boundary depending on whether es2018 is enabled or not
    return options.es2018 ? pashtoWordBoundaryBeginningWithES2018 : pashtoWordBoundaryBeginning;
}
function prepareEnding(options) {
    if (options.matchWholeWordOnly) {
        return "(?![" + pashtoCharacterRange + "])";
    }
    if (options.returnWholeWord) {
        return "[" + pashtoCharacterRange + "]*(?![" + pashtoCharacterRange + "])";
    }
    return "";
}
function prepareFlags(options) {
    return "m" + (options.globalMatch === false ? "" : "g");
}
// Main function for returning a regular expression based on a string of Pashto text
function fuzzifyPashto(input, options) {
    if (options === void 0) { options = {}; }
    var sanitizedInput = sanitizeInput(input, options);
    var mainRegexLogic = prepareMainRegexLogic(sanitizedInput, options);
    var beginning = prepareBeginning(options);
    var ending = prepareEnding(options);
    var flags = prepareFlags(options);
    return new RegExp("" + beginning + mainRegexLogic + ending, flags);
}
// Convienience function for testing if an environment supports lookbehind assertions
// Lookbehind assertions allow for cleaner word matching. 
// (Punctuation directly in fron of the word is ignored and there is no extra space)
function es2018IsSupported() {
    var supported = true;
    try {
        // Test expression to see if environment supports lookbehind assertions
        var a = new RegExp("(?<!a)b");
    }
    catch (error) {
        // Environment does not support lookbehind assertions in regex
        // Must ignore this line for testing, because not all environments can/will error here
        /* istanbul ignore next */
        supported = false;
    }
    return supported;
}

export { es2018IsSupported, fuzzifyPashto };
//# sourceMappingURL=fuzzify-pashto.es5.js.map
