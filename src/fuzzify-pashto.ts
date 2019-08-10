const sSounds = "صسثڅ";
const zSounds = "زضظذځ";
const tdSounds = "طتټدډ";
const velarPlosives = "ګږکقگك";
const labialPlosivesAndFricatives = "فپب";
// Includes Arabic ى \u0649
const theFiveYeys = "ېۍیيئےى";

// TODO: Deal with diacritics etc.
// .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');

const pashtoReplacer = {
  "ا": "اآهع", // TODO: make optional
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

  "ع": "اوع", // TODO: make optional
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

  "ژ": 'زضظذځږ',

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

  "ږ": 'ژ' + velarPlosives,

  "ب": labialPlosivesAndFricatives,
  "پ": labialPlosivesAndFricatives,
  "ف": labialPlosivesAndFricatives,
}

const thingsToReplace = Object.keys(pashtoReplacer);
const pashtoReplacerRegex = new RegExp(thingsToReplace.reduce((accumulator, currentValue, i) => {
  if (i === thingsToReplace.length - 1) {
    return accumulator + currentValue; 
  } 
  return accumulator + currentValue + "|";
}, ""), "g");

// enum beginningAtOptions {
//   beginningOfWord = "beginningOfWord", // default
//   beginningOfString = "beginningOfString",
//   anywhere = "anywhere", // TODO: This conflicts with matchWholeWord
// }

interface FuzzifyOptions {
  beginningAt?: string;
  matchWholeWord?: boolean;
  allowSpacesInWords?: boolean;
  singleMatchOnly?: boolean;
}

export function fuzzifyPashto(input: string, options: FuzzifyOptions): RegExp {
  let safeInput = input.replace(/[#-.]|[[-^]|[?|{}]/g, '');
  if (options.allowSpacesInWords) {
    safeInput = safeInput.replace(/ /g, '');
  }
  const regexLogic = safeInput.trim().replace(pashtoReplacerRegex, (mtch) => {
    return `[${pashtoReplacer[mtch]}]${options.allowSpacesInWords ? '\ ?' : ''}`
  });
  // TODO: Account for punctuation at the beginning of words
  const pashtoWordBoundaryBeginning = "(^|[^\u0600-\u06FF])"
  // Set how to begin the matching (default at the beginning of a word)
  let beginning = options.beginningAt === "string" ? "^" :
                    options.beginningAt === "anywhere" ? "" :
                    pashtoWordBoundaryBeginning; // "word" is the default
  let ending = "";
  if (options.matchWholeWord) {
    if (options.beginningAt === "anywhere") beginning = pashtoWordBoundaryBeginning;
    ending = "(?![\u0600-\u06FF])";
  }
  return new RegExp(beginning + regexLogic + ending, `${options.singleMatchOnly ? '' : 'g'}`);
}
  