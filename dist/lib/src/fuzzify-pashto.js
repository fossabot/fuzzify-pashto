"use strict";
/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var replacer_1 = require("./replacer");
exports.pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
// Unfortunately, without ES2018 lookbehind assertions word boundary matching is not as clean
// Without lookbehind assertions, we are unable to ignore punctuation directly in front of a word
// and matching results include a space before the word
exports.pashtoWordBoundaryBeginning = "(?:^|[^" + exports.pashtoCharacterRange + "])";
// These problems are solved by using the ES2018 lookbehind assertions where environments permit
exports.pashtoWordBoundaryBeginningWithES2018 = "(?<![" + exports.pashtoCharacterRange + "])";
var diacritics = "\u064b-\u065f\u0670\u0674"; // pretty generous diactritic range
function sanitizeInput(input, options) {
    var safeInput = input.trim().replace(/[#-.]|[[-^]|[?|{}]/g, "");
    if (options.allowSpacesInWords) {
        safeInput = safeInput.replace(/ /g, "");
    }
    if (options.ignoreDiacritics) {
        // Using literal regular expressions instead of variable for security linting
        safeInput = safeInput.replace(new RegExp("[\u064b-\u065f\u0670\u0674]", "g"), "");
    }
    return safeInput;
}
function prepareMainRegexLogicLatin(sanitizedInput, options) {
    return sanitizedInput.replace(replacer_1.latinReplacerRegex, function (mtch) {
        var r = replacer_1.latinReplacerInfo.find(function (x) { return x.char === mtch; });
        var section = r && r.repl;
        // TODO: Should we allow ignorable letters as we do with the Pashto script?
        // tslint:disable-next-line
        return "" + section + (options.allowSpacesInWords ? "\ ?" : "");
    });
}
function prepareMainRegexLogicPashto(sanitizedInput, options) {
    return sanitizedInput.replace(replacer_1.pashtoReplacerRegex, function (mtch) {
        var r = replacer_1.pashtoReplacerInfo.find(function (x) { return x.char === mtch; });
        var section = "[" + (r && r.range) + "]";
        if (r && r.plus) {
            var additionalOptionGroups = r.plus.join("|");
            section = "(?:" + section + "|" + additionalOptionGroups + ")";
        }
        // tslint:disable-next-line
        return "" + section + (r && r.ignorable ? "?" : "") + "\u0639?" + (options.ignoreDiacritics ? "[" + diacritics + "]?" : "") + (options.allowSpacesInWords ? "\ ?" : "");
    });
}
function getBeginningWithAnywhere(options) {
    // Override the "anywhere" when matchWholeWordOnly is true
    if (options.matchWholeWordOnly) {
        return (options.script === "Latin") ? "\\b" : exports.pashtoWordBoundaryBeginning;
    }
    if (options.returnWholeWord) {
        // Return the whole world even if matching from the middle (if desired)
        if (options.script === "Latin") {
            return "\\b\\S*";
        }
        return exports.pashtoWordBoundaryBeginning + "[" + exports.pashtoCharacterRange + "]*";
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
    if (options.script === "Latin") {
        return "\\b";
    }
    return options.es2018 ? exports.pashtoWordBoundaryBeginningWithES2018 : exports.pashtoWordBoundaryBeginning;
}
function prepareEnding(options) {
    if (options.matchWholeWordOnly) {
        return (options.script === "Latin") ? "\\b" : "(?![" + exports.pashtoCharacterRange + "])";
    }
    if (options.returnWholeWord) {
        return (options.script === "Latin") ? "\\S*\\b" : "[" + exports.pashtoCharacterRange + "]*(?![" + exports.pashtoCharacterRange + "])";
    }
    return "";
}
// Main function for returning a regular expression based on a string of Pashto text
function fuzzifyPashto(input, options) {
    if (options === void 0) { options = {}; }
    var sanitizedInput = sanitizeInput(input, options);
    var mainRegexLogic;
    if (options.script === "Latin") {
        mainRegexLogic = prepareMainRegexLogicLatin(sanitizedInput, options);
    }
    else {
        mainRegexLogic = prepareMainRegexLogicPashto(sanitizedInput, options);
    }
    var beginning = prepareBeginning(options);
    var ending = prepareEnding(options);
    return "" + beginning + mainRegexLogic + ending;
}
exports.fuzzifyPashto = fuzzifyPashto;
//# sourceMappingURL=fuzzify-pashto.js.map