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
   * @flow
   */
  var pashtoCharacterRange = "\u0600-\u06FF";
  var sSounds = "صسثڅ";
  var zSounds = "زضظذځژ";
  var tdSounds = "طتټدډ";
  var velarPlosives = "ګږکقگك";
  var labialPlosivesAndFricatives = "فپب";
  // Includes Arabic ى \u0649  
  var theFiveYeys = "ېۍیيئےى";
  // TODO: Deal with diacritics etc.
  // .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');
  // TOOD: handle "" input
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
      "ر": 'رړ',
      "ړ": 'رړ',
      "ڑ": 'رړ',
      "ت": tdSounds,
      "ټ": tdSounds,
      "ٹ": tdSounds,
      "ط": tdSounds,
      "د": tdSounds,
      "ډ": tdSounds,
      "ڈ": tdSounds,
      "نب": 'نبم',
      "ن": 'نڼ',
      "ڼ": 'نڼ',
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
  // TODO: This options initializer is needed for it to work in the browser environment
  // but it also makes us lose code coverage
  function fuzzifyPashto(input, options) {
      if (options === void 0) { options = {}; }
      var safeInput = input.replace(/[#-.]|[[-^]|[?|{}]/g, '');
      if (options.allowSpacesInWords) {
          safeInput = safeInput.replace(/ /g, '');
      }
      var regexLogic = safeInput.trim().replace(pashtoReplacerRegex, function (mtch) {
          return "[" + pashtoReplacer[mtch] + "]" + (options.allowSpacesInWords ? '\ ?' : '');
      });
      // TODO: Account for punctuation at the beginning of words
      var pashtoWordBoundaryBeginning = "(^|[^" + pashtoCharacterRange + "])";
      // Set how to begin the matching (default at the beginning of a word)
      var beginning = options.beginningAt === "string" ? "^" :
          options.beginningAt === "anywhere" ? "" :
              pashtoWordBoundaryBeginning; // "word" is the default
      var ending = "";
      if (options.matchWholeWordOnly) {
          if (options.beginningAt === "anywhere")
              beginning = pashtoWordBoundaryBeginning;
          ending = "(?![" + pashtoCharacterRange + "])";
      }
      // If they're already using matchWholeWordOnly, don't change it
      if (options.returnWholeWord && !options.matchWholeWordOnly) {
          ending = "[" + pashtoCharacterRange + "]*(?![" + pashtoCharacterRange + "])";
          if (options.beginningAt === "anywhere") {
              beginning = pashtoWordBoundaryBeginning + "[" + pashtoCharacterRange + "]*";
          }
      }
      return new RegExp(beginning + regexLogic + ending, "m" + (options.singleMatchOnly ? '' : 'g'));
  }

  exports.fuzzifyPashto = fuzzifyPashto;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=fuzzify-pashto.umd.js.map
