// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
  // import "core-js/fn/array.find"
  // ...

const sSounds = "[ص س ث څ]";
const zSounds = "[ز ض ظ ذ ځ]";
const tdSounds = "[ط ت ټ د ډ]";
const velarPlosives = "[ګ ږ ک ق گ ك]";
const labialPlosivesAndFricatives = "[ف پ ب]";
// Includes Arabic ى \u0649
const theFiveYeys = "[ې ۍ ی ي ئ ے ى]";

// TODO: Deal with diacritics etc.
// .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');

const pashtoReplacer = {
  "ا": "[ا آ ه ع]?",
  "آ": "[ا آ ه]",
  "ٱ": "[ا آ ه]",
  "ٲ": "[ا آ ه]",
  "ٳ": "[ا آ ه]",

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

  "ج": "[چ ج څ]", 
  "چ": "[چ ج څ]",
  
  "ه": "[ا ه ح ہ]",
  "ۀ": "[ا ه ح ہ]",
  "ہ": "[ا ه ح ہ]",

  "ع": "[ا و ع]?",
  "و": "[و ع]",
  "ؤ": "[و ع]",
  
  "ښ": "[ښ خ ش خ ه ح غ]",
  "غ": '[ښ خ ش خ ه ح غ]',
  "خ": '[ښ خ ش خ ه ح غ]',
  "ح": '[ښ خ ش خ ه ح غ]',

  "ش": '[ش ښ]',

  "ز": zSounds,
  "ض": zSounds,
  "ذ": zSounds,
  "ځ": zSounds,
  "ظ": zSounds,

  "ژ": '[ز ض ظ ذ ځ ږ]',

  "ر": '[ر ړ]',
  "ړ": '[ر ړ]',
  "ڑ": '[ر ړ]',

  "ت": tdSounds,
  "ټ": tdSounds,
  "ٹ": tdSounds,
  "ط": tdSounds,
  "د": tdSounds,
  "ډ": tdSounds,
  "ڈ": tdSounds,

  "نب": '[نب م]',
  "ن": '[ن ڼ]',
  "ڼ": '[ن ڼ]',

  "ک": velarPlosives,
  "ګ": velarPlosives,
  "گ": velarPlosives,
  "ق": velarPlosives,

  "ږ": '[ګ ږ ک ق ژ]',

  "ب": labialPlosivesAndFricatives,
  "پ": labialPlosivesAndFricatives,
  "ف": labialPlosivesAndFricatives,
  " ": "",
}

const thingsToReplace = Object.keys(pashtoReplacer);
const pashtoReplacerRegex = new RegExp(thingsToReplace.reduce((accumulator, currentValue, i) => {
  if (i === thingsToReplace.length - 1) {
    return accumulator + currentValue; 
  } 
  return accumulator + currentValue + "|";
}, ""), "g");

export function fuzzifyPashto(input: string): RegExp {
  const regexLogic = input.trim().replace(pashtoReplacerRegex, (mtch) => pashtoReplacer[mtch]);
  // TODO: Do beginning of word re: https://stackoverflow.com/questions/40731058/regex-match-arabic-keyword
  return new RegExp('^' + regexLogic, '');
}
  