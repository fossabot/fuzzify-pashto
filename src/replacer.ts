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

interface IReplacerInfoItem {
  char: string;
  ignorable?: boolean;
}

interface IPashtoReplacerInfoItem extends IReplacerInfoItem {
  range?: string;
  repl?: string;
  plus?: string[];
}

interface IPhoneticsReplacerInfoItem extends IReplacerInfoItem {
  repl?: string;
}

export const pashtoReplacerInfo: IPashtoReplacerInfoItem[] = [
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

// tslint:disable-next-line
export const pashtoReplacerRegex = /اً|ا|آ|ٱ|ٲ|ٳ|ی|ي|ې|ۍ|ئ|ے|س|ص|ث|څ|ج|چ|ه|ۀ|ہ|ع|و|ؤ|ښ|غ|خ|ح|ش|ز|ض|ذ|ځ|ظ|ژ|ر|ړ|ڑ|ت|ټ|ٹ|ط|د|ډ|ڈ|نب|ن|ڼ|ک|ګ|گ|ق|ږ|ب|پ|ف/g;

const aaySoundLatin = "h?(?:[aá]a?i|[eé]y|[aá]a?y|[aá]h?i)";
const longASoundLatin = "(?:[aá]a?)h?";
const shortASoundLatin = "h?(?:[aáă]a?|au|áu|[uú]|[UÚ]|[ií]|[eé])?h?";
const shwaSoundLatin = "h?(?:[uú]|[oó]o?|w[uú]|[aáă]|[ií]|[UÚ])?h?";
const ooSoundLatin = "h?(?:[oó]o?|[áa]u|w[uú]|[aá]w|[uú]|[UÚ])(?:h|w)?";
const eySoundLatin = "h?(?:[eé]y|[eé]e?|[uú]y|[aá]y|[ií])";
const middleESoundLatin = "h?(?:[eé]e?|[ií]|[aáă]|[eé])(?:h|y)?";
const iSoundLatin = "h?(?:[uú]|[aáă]|[ií]|[eé]e?)?h?";

export const latinReplacerInfo: IPhoneticsReplacerInfoItem[] = [
  { char: "aa", repl: longASoundLatin },
  { char: "áa", repl: longASoundLatin },
  { char: "aai", repl: aaySoundLatin },
  { char: "áai", repl: aaySoundLatin },
  { char: "ai", repl: aaySoundLatin },
  { char: "ái", repl: aaySoundLatin },
  { char: "aay", repl: aaySoundLatin },
  { char: "áay", repl: aaySoundLatin },
  { char: "ay", repl: aaySoundLatin },
  { char: "áy", repl: aaySoundLatin },
  { char: "a", repl: shortASoundLatin },
  { char: "ă", repl: shortASoundLatin },
  { char: "á", repl: shortASoundLatin },
  { char: "u", repl: shwaSoundLatin },
  { char: "ú", repl: shwaSoundLatin },
  { char: "U", repl: ooSoundLatin },
  { char: "Ú", repl: ooSoundLatin },
  { char: "o", repl: ooSoundLatin },
  { char: "ó", repl: ooSoundLatin },
  { char: "oo", repl: ooSoundLatin },
  { char: "óo", repl: ooSoundLatin },
  { char: "i", repl: iSoundLatin },
  { char: "í", repl: iSoundLatin },
  { char: "ey", repl: eySoundLatin },
  { char: "éy", repl: eySoundLatin },
  { char: "ee", repl: eySoundLatin },
  { char: "ée", repl: eySoundLatin },
  { char: "uy", repl: eySoundLatin },
  { char: "úy", repl: eySoundLatin },
  { char: "e", repl: middleESoundLatin },
  { char: "é", repl: middleESoundLatin },
  { char: "w", repl: "w{1,2}?[UÚ]?"},
  { char: "y", repl: "[ií]?y?"},

  { char: "ts", repl: "(?:s{1,2}|z{1,2|ts)"},
  { char: "s", repl: "(?:s{1,2}|z{1,2|ts)"},
  { char: "dz", repl: "(?:dz|z{1,2}|j)"},
  { char:  "z", repl: "(?:s{1,2}|dz|z{1,2}|ts)"},
  { char: "t", repl: "(?:t{1,2}|T|d{1,2}|D)"},
  { char: "tt", repl: "(?:t{1,2}|T|d{1,2}|D)"},
  { char: "T", repl: "(?:t{1,2}|T|d{1,2}|D)"},
  { char: "d", repl: "(?:t{1,2}|T|d{1,2}|D)"},
  { char: "dd", repl: "(?:t{1,2}|T|d{1,2}|D)"},
  { char: "D", repl: "(?:t{1,2}|T|d{1,2}|D)"},
  { char: "r", repl: "(?:R|r{1,2}|N)"},
  { char: "rr", repl: "(?:R|r{1,2}|N)"},
  { char: "R", repl: "(?:R|r{1,2}|N)"},
  { char: "n", repl: "(?:n{1,2}|N)"},
  { char: "N", repl: "(?:R|r{1,2}|N)"},
  { char: "f", repl: "(?:f{1,2}|p{1,2})"},
  { char: "ff", repl: "(?:f{1,2}|p{1,2})"},
  { char: "b", repl: "(?:b{1,2}|p{1,2})"},
  { char: "bb", repl: "(?:b{1,2}|p{1,2})"},
  { char: "p", repl: "(?:b{1,2}|p{1,2}|f{1,2})"},
  { char: "pp", repl: "(?:b{1,2}|p{1,2}|f{1,2})"},

  { char: "sh", repl: "(?:x|sh)"},
  { char: "x", repl: "(?:kh|gh|x|h){1,2}"},
  { char: "kh", repl: "(?:kh|gh|x|h){1,2}"},

  { char: "k", repl: "(?:k{1,2}|q{1,2}|kh|g|G)"},
  { char: "q", repl: "(?:k{1,2}|q{1,2}|kh|g|G)"},

  { char: "jz", repl: "(?:G|jz)"},
  { char: "G", repl: "(?:jz|G|g)"},

  { char: "g", repl: "(?:gh?|k{1,2}|G)"},
  { char: "gh", repl: "(?:g|gh|kh|G)"},

  { char: "j", repl: "(?:j{1,2}|ch|dz)"},
  { char: "ch", repl: "(?:j{1,2}|ch)"},

  { char: "l", repl: "l{1,2}"},
  { char: "ll", repl: "l{1,2}"},
  { char: "m", repl: "m{1,2}"},
  { char: "mm", repl: "m{1,2}"},
  { char: "h", repl: "k?h?"},
];

// tslint:disable-next-line
export const latinReplacerRegex = /aa|áa|a{1,2}[i|y]|á{1,2}[i|y]|a|á|U|Ú|u|ú|o{1,2}|óo|ó|e{1,2}|ée|é|ey|éy|uy|úy|i|í|w|y|q|g|ts|sh|s|dz|z|tt|t|T|dd|d|D|r{1,2}|R|n{1,2}|N|f{1,2}|f|b{1,2}|p{1,2}|x|kh|q|k|gh|g|G|j|ch|ll|l|m{1,2}|h/g;
