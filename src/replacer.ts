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

type replacerInfoItem = { 
  char: string, 
  range: string, 
  plus?: string[],
  ignorable?: boolean, 
}

const pashtoReplacerInfo: replacerInfoItem[] = [
  { char: "اً", range: "ان" },
  { char: "ا", range: "اآهع", plus: ["اً"] }, // TODO: make optional (if not at the beginning of word)
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
  { char: "ؤ", range: "وع"},
  
  { char: "ښ", range: guttural },
  { char: "غ", range: guttural },
  { char: "خ", range: guttural },
  { char: "ح", range: guttural },

  { char: "ش", range: "شښ" },

  { char: "ز", range: zSounds },
  { char: "ض", range: zSounds },
  { char: "ذ", range: zSounds },
  { char: "ځ", range: zSounds + "جڅ"},
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
  { char: "ن", range: "نڼ", plus: ["اً"] }, // allow for words using اٌ at the end to be seached for with ن
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

const pashtoReplacerRegex = /اً|ا|آ|ٱ|ٲ|ٳ|ی|ي|ې|ۍ|ئ|ے|س|ص|ث|څ|ج|چ|ه|ۀ|ہ|ع|و|ؤ|ښ|غ|خ|ح|ش|ز|ض|ذ|ځ|ظ|ژ|ر|ړ|ڑ|ت|ټ|ٹ|ط|د|ډ|ڈ|نب|ن|ڼ|ک|ګ|گ|ق|ږ|ب|پ|ف/g;

export { pashtoReplacerInfo, pashtoReplacerRegex };
