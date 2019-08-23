(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.fuzzifyPashto = {}));
}(this, function (exports) { 'use strict';

  /**
   * Copyright (c) openpashto.com
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *
   */
  // Arabic punctuation to exclude
  // ، \u060c ؟ \u061f ؛ \u061b ۔ \u06d4
  // Digits etc. exclude \u0660 - \u066f
  var pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
  // ISSUE: This does not work if the word is starting with a non-Pashto character like " or « or .
  // I don't know how to solve this without lookbehinds in JavaScript (not available on all platforms)
  // Need to try all these ideas: https://stackoverflow.com/questions/641407/javascript-negative-lookbehind-equivalent
  var pashtoWordBoundaryBeginning = "(?:^|[^" + pashtoCharacterRange + "])";
  var pashtoWordBoundaryBeginningWithEs2018 = "(?<![" + pashtoCharacterRange + "])";
  // something like this: ([^${pashtoCharacterRange}]?)abc  plus not whitespace/punctuation etc.
  // TODO: Deal with diacritics etc.
  // .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');
  // TODO: PROPER WORD BEGINNINGS!
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
      "ښ": { range: "ښخشخهحغ" },
      "غ": { range: 'ښخشخهحغ' },
      "خ": { range: 'ښخشخهحغ' },
      "ح": { range: 'ښخشخهحغ' },
      "ش": { range: 'شښ' },
      "ز": { range: zSounds },
      "ض": { range: zSounds },
      "ذ": { range: zSounds },
      "ځ": { range: zSounds + "جڅ" },
      "ظ": { range: zSounds },
      "ژ": { range: 'زضظژذځږج' },
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
      "نب": { range: 'نبم' },
      "ن": { range: 'نڼ', plus: ["اً"] },
      "ڼ": { range: 'نڼړڑ' },
      "ک": { range: velarPlosives },
      "ګ": { range: velarPlosives },
      "گ": { range: velarPlosives },
      "ق": { range: velarPlosives },
      "ږ": { range: velarPlosives + 'ژ' },
      "ب": { range: labialPlosivesAndFricatives },
      "پ": { range: labialPlosivesAndFricatives },
      "ف": { range: labialPlosivesAndFricatives },
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
      var safeInput = input.trim().replace(/[#-.]|[[-^]|[?|{}]/g, '');
      if (options.allowSpacesInWords) {
          safeInput = safeInput.replace(/ /g, '');
      }
      var regexLogic = safeInput.replace(pashtoReplacerRegex, function (mtch) {
          var r = pashtoReplacer[mtch];
          var range = "[" + r.range + "]";
          if (r.plus) {
              var additionalOptionGroups = r.plus.reduce(function (t, o) {
                  return t + o + "|";
              }, "");
              range = "(" + additionalOptionGroups + range + ")";
          }
          return "" + range + (r.ignorable ? '?' : '') + "\u0639?" + (options.allowSpacesInWords ? '\ ?' : '');
      });
      // Set how to begin the matching (default at the beginning of a word)
      var beginning;
      if (options.matchStart === "string")
          beginning = "^";
      else if (options.matchStart === "anywhere")
          beginning = "";
      else {
          // "word" is the default
          if (options.es2018)
              beginning = pashtoWordBoundaryBeginningWithEs2018;
          else
              beginning = pashtoWordBoundaryBeginning;
      }
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

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=fuzzify-pashto.umd.js.map
