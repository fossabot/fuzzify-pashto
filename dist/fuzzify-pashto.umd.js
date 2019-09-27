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
  var pashtoReplacerInfo = [
      { char: "اً", range: "ان" },
      { char: "ا", range: "اآهع", plus: ["اً"] },
      { char: "آ", range: "اآه" },
      { char: "ٱ", range: "اآه" },
      { char: "ٲ", range: "اآه" },
      { char: "ٳ", range: "اآه" },
      { char: "ی", range: theFiveYeys },
      { char: "ي", range: theFiveYeys },
      { char: "ې", range: theFiveYeys },
      { char: "ۍ", range: theFiveYeys },
      { char: "ئ", range: theFiveYeys },
      { char: "ے", range: theFiveYeys },
      { char: "س", range: sSounds },
      { char: "ص", range: sSounds },
      { char: "ث", range: sSounds },
      { char: "څ", range: sSounds + "چ" },
      { char: "ج", range: "چجڅځژ" },
      { char: "چ", range: "چجڅځ" },
      { char: "ه", range: "اهحہ" },
      { char: "ۀ", range: "اهحہ" },
      { char: "ہ", range: "اهحہ" },
      { char: "ع", range: "اوع", ignorable: true },
      { char: "و", range: "وع", ignorable: true },
      { char: "ؤ", range: "وع" },
      { char: "ښ", range: guttural },
      { char: "غ", range: guttural },
      { char: "خ", range: guttural },
      { char: "ح", range: guttural },
      { char: "ش", range: "شښ" },
      { char: "ز", range: zSounds },
      { char: "ض", range: zSounds },
      { char: "ذ", range: zSounds },
      { char: "ځ", range: zSounds + "جڅ" },
      { char: "ظ", range: zSounds },
      { char: "ژ", range: "زضظژذځږج" },
      { char: "ر", range: rLikeSounds },
      { char: "ړ", range: rLikeSounds },
      { char: "ڑ", range: rLikeSounds },
      { char: "ت", range: tdSounds },
      { char: "ټ", range: tdSounds },
      { char: "ٹ", range: tdSounds },
      { char: "ط", range: tdSounds },
      { char: "د", range: tdSounds },
      { char: "ډ", range: tdSounds },
      { char: "ڈ", range: tdSounds },
      { char: "نب", range: "نبم" },
      { char: "ن", range: "نڼ", plus: ["اً"] },
      { char: "ڼ", range: "نڼړڑ" },
      { char: "ک", range: velarPlosives },
      { char: "ګ", range: velarPlosives },
      { char: "گ", range: velarPlosives },
      { char: "ق", range: velarPlosives },
      { char: "ږ", range: velarPlosives + "ژ" },
      { char: "ب", range: labialPlosivesAndFricatives },
      { char: "پ", range: labialPlosivesAndFricatives },
      { char: "ف", range: labialPlosivesAndFricatives },
  ];
  // tslint:disable-next-line
  var pashtoReplacerRegex = /اً|ا|آ|ٱ|ٲ|ٳ|ی|ي|ې|ۍ|ئ|ے|س|ص|ث|څ|ج|چ|ه|ۀ|ہ|ع|و|ؤ|ښ|غ|خ|ح|ش|ز|ض|ذ|ځ|ظ|ژ|ر|ړ|ڑ|ت|ټ|ٹ|ط|د|ډ|ڈ|نب|ن|ڼ|ک|ګ|گ|ق|ږ|ب|پ|ف/g;

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
          // Using literal regular expressions instead of variable for security linting
          safeInput = safeInput.replace(new RegExp("[\u064b-\u065f\u0670\u0674]", "g"), "");
      }
      return safeInput;
  }
  function prepareMainRegexLogic(sanitizedInput, options) {
      return sanitizedInput.replace(pashtoReplacerRegex, function (mtch) {
          var r = pashtoReplacerInfo.find(function (x) { return x.char === mtch; });
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
  // Main function for returning a regular expression based on a string of Pashto text
  function fuzzifyPashto(input, options) {
      if (options === void 0) { options = {}; }
      var sanitizedInput = sanitizeInput(input, options);
      var mainRegexLogic = prepareMainRegexLogic(sanitizedInput, options);
      var beginning = prepareBeginning(options);
      var ending = prepareEnding(options);
      return "" + beginning + mainRegexLogic + ending;
  }

  exports.fuzzifyPashto = fuzzifyPashto;
  exports.pashtoCharacterRange = pashtoCharacterRange;
  exports.pashtoWordBoundaryBeginning = pashtoWordBoundaryBeginning;
  exports.pashtoWordBoundaryBeginningWithES2018 = pashtoWordBoundaryBeginningWithES2018;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=fuzzify-pashto.umd.js.map
