/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// TODO: add southern ش س (at beginning of word?)
const sSounds = "صسثڅ";
const zSounds = "زضظذځژ";
const tdSounds = "طتټدډ";
const velarPlosives = "ګږکقگك";
const rLikeSounds = "رړڑڼ";
const labialPlosivesAndFricatives = "فپب";
// Includes Arabic ى \u0649  
const theFiveYeys = "ېۍیيئےى";
const guttural = "ښخشخهحغ";

const pashtoReplacerInfo = {
  "اً": { range: "ان" },
  "ا": { range: "اآهع", plus: ["اً"] }, // TODO: make optional (if not at the beginning of word)
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
  "ؤ": { range: "وع"},
  
  "ښ": { range: guttural },
  "غ": { range: guttural },
  "خ": { range: guttural },
  "ح": { range: guttural },

  "ش": { range: "شښ" },

  "ز": { range: zSounds },
  "ض": { range: zSounds },
  "ذ": { range: zSounds },
  "ځ": { range: zSounds + "جڅ"},
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
  "ن": { range: "نڼ", plus: ["اً"] }, // allow for words using اٌ at the end to be seached for with ن
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

const pashtoReplacerRegex = new RegExp(
  Object.keys(pashtoReplacerInfo).join("|"), 
  "g",
);

export { pashtoReplacerInfo, pashtoReplacerRegex };
