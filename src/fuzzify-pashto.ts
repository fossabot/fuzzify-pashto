/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

interface FuzzifyOptions {
  globalMatch?: boolean;
  matchStart?: string;
  matchWholeWordOnly?: boolean;
  allowSpacesInWords?: boolean;
  returnWholeWord?: boolean;
  es2018?: boolean;
  ignoreDiacritics?: boolean;
}

// Arabic punctuation to exclude
// ، \u060c ؟ \u061f ؛ \u061b ۔ \u06d4
// Digits etc. exclude \u0660 - \u066f

const pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
// ISSUE: This does not work if the word is starting with a non-Pashto character like " or « or .
// I don't know how to solve this without lookbehinds in JavaScript (not available on all platforms)
const pashtoWordBoundaryBeginning = `(?:^|[^${pashtoCharacterRange}])`;
// TODO: Better testing here - to see if this is really working in all cases
const pashtoWordBoundaryBeginningWithEs2018 = `(?<![${pashtoCharacterRange}])`;
const diacritics = "\u064b-\u065f\u0670\u0674"; // pretty generous diactritic range
// TODO: Deal with diacritics etc.
// .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');
// TODO: PROPER WORD BEGINNINGS!

// TODO: add southern ش س (at beginning of word?)

const sSounds = "صسثڅ";
const zSounds = "زضظذځژ";
const tdSounds = "طتټدډ";
const velarPlosives = "ګږکقگك";
const rLikeSounds = "رړڑڼ";
const labialPlosivesAndFricatives = "فپب";
// Includes Arabic ى \u0649  
const theFiveYeys = "ېۍیيئےى";

const pashtoReplacer = {
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
  
  "ښ": { range: "ښخشخهحغ" },
  "غ": { range: "ښخشخهحغ" },
  "خ": { range: "ښخشخهحغ" },
  "ح": { range: "ښخشخهحغ" },

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
  "ن": { range: "نڼ", plus: ["اً"] }, // allow for words using اٌ at the end te be seached for with ن
  "ڼ": { range: "نڼړڑ" },

  "ک": { range: velarPlosives },
  "ګ": { range: velarPlosives },
  "گ": { range: velarPlosives },
  "ق": { range: velarPlosives },

  "ږ": { range: velarPlosives + "ژ" },

  "ب": { range: labialPlosivesAndFricatives },
  "پ": { range: labialPlosivesAndFricatives },
  "ف": { range: labialPlosivesAndFricatives },
}

const thingsToReplace = Object.keys(pashtoReplacer);
const pashtoReplacerRegex = new RegExp(thingsToReplace.reduce((accumulator, currentValue, i) => {
  if (i === thingsToReplace.length - 1) {
    return accumulator + currentValue; 
  } 
  return accumulator + currentValue + "|";
}, ""), "g");

export function es2018IsSupported(): boolean {
  let supported = true;
  try {
    const a = new RegExp('(?<!a)b')
  } catch(error) {
    // Must ignore this line for testing, because not all environments can/will error here
    /* istanbul ignore next */ 
    supported = false;
  }
  return supported;
}

export function fuzzifyPashto(input: string, options: FuzzifyOptions = {}): RegExp {
  let safeInput = input.trim().replace(/[#-.]|[[-^]|[?|{}]/g, '');
  if (options.allowSpacesInWords) {
    safeInput = safeInput.replace(/ /g, '');
  }
  if (options.ignoreDiacritics) {
    safeInput = safeInput.replace(new RegExp(`[${diacritics}]`, "g"), '');
  }
  const regexLogic = safeInput.replace(pashtoReplacerRegex, (mtch) => {
    const r = pashtoReplacer[mtch];
    let range = `[${r.range}]`;
    if (r.plus) {
      const additionalOptionGroups = r.plus.reduce((t: string, o: string) => {
        return t + o + "|";
      }, "");
      range = `(${additionalOptionGroups}${range})`;
    }
    return `${range}${r.ignorable ? '?' : ''}ع?${options.ignoreDiacritics ? `[${diacritics}]?`: ''}${options.allowSpacesInWords ? '\ ?' : ''}`
  });
  // Set how to begin the matching (default at the beginning of a word)
  let beginning;
  if (options.matchStart === "string") {
    beginning = "^";
  } else if (options.matchStart === "anywhere") {
    beginning = "";
  } else {
    // "word" is the default
    if (options.es2018) {
      beginning = pashtoWordBoundaryBeginningWithEs2018;
    } else {
      beginning = pashtoWordBoundaryBeginning;
    }
  }
  
  let ending = "";
  if (options.matchWholeWordOnly) {
    if (options.matchStart === "anywhere") beginning = pashtoWordBoundaryBeginning;
    ending = `(?![${pashtoCharacterRange}])`;
  }
  // If they're already using matchWholeWordOnly, don't change it
  if (options.returnWholeWord && !options.matchWholeWordOnly) {
    ending = `[${pashtoCharacterRange}]*(?![${pashtoCharacterRange}])`;
    if (options.matchStart === "anywhere") {
      beginning = `${pashtoWordBoundaryBeginning}[${pashtoCharacterRange}]*`; 
    }
  }
  const flags = `m${options.globalMatch === false ? "" : "g"}`;
  return new RegExp(`${beginning}${regexLogic}${ending}`, flags);
}
  