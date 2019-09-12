/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { pashtoReplacerRegex, pashtoReplacer } from './replacer';

interface FuzzifyOptions {
  globalMatch?: boolean;
  matchStart?: string;
  matchWholeWordOnly?: boolean;
  allowSpacesInWords?: boolean;
  returnWholeWord?: boolean;
  es2018?: boolean;
  ignoreDiacritics?: boolean;
}

const pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
// Unfortunately, without ES2018 lookbehind assertions word boundary matching is not as clean
// Without lookbehind assertions, we are unable to ignore punctuation directly in front of a word
// and matching results include a space before the word
const pashtoWordBoundaryBeginning = `(?:^|[^${pashtoCharacterRange}])`;
// These problems are solved by using the ES2018 lookbehind assertions where environments permit
const pashtoWordBoundaryBeginningWithES2018 = `(?<![${pashtoCharacterRange}])`;
const diacritics = "\u064b-\u065f\u0670\u0674"; // pretty generous diactritic range

// NON-EXPORTED HELPER FUNCTIONS

function sanitizeInput(input: string, options: FuzzifyOptions): string {
  let safeInput = input.trim().replace(/[#-.]|[[-^]|[?|{}]/g, "");
  if (options.allowSpacesInWords) {
    safeInput = safeInput.replace(/ /g, "");
  }
  if (options.ignoreDiacritics) {
    safeInput = safeInput.replace(new RegExp(`[${diacritics}]`, "g"), "");
  }
  return safeInput;
}

function prepareMainRegexLogic(sanitizedInput: string, options: FuzzifyOptions): string {
  return sanitizedInput.replace(pashtoReplacerRegex, (mtch) => {
    const r = pashtoReplacer[mtch];
    let range = `[${r.range}]`;
    if (r.plus) {
      const additionalOptionGroups = r.plus.reduce((t: string, o: string) => {
        return t + o + "|";
      }, "");
      range = `(${additionalOptionGroups}${range})`;
    }
    return `${range}${r.ignorable ? "?" : ""}ع?${options.ignoreDiacritics ? `[${diacritics}]?`: ""}${options.allowSpacesInWords ? "\ ?" : ""}`;
  });
}

function prepareBeginning(options: FuzzifyOptions): string {
  let beginning;
  if (options.matchStart === "string") {
    beginning = "^";
  } else if (options.matchStart === "anywhere") {
    beginning = "";
  } else {
    // options.matchStart === "word" is the default
    if (options.es2018) {
      beginning = pashtoWordBoundaryBeginningWithES2018;
    } else {
      beginning = pashtoWordBoundaryBeginning;
    }
  }
  // Override the "anywhere" when matchWholeWordOnly is true
  if (options.matchStart === "anywhere" && options.matchWholeWordOnly) {
    beginning = pashtoWordBoundaryBeginning;
  }
  // Return the whole world even if matching from the middle (if desired)
  if (options.returnWholeWord && !options.matchWholeWordOnly) {
    if (options.matchStart === "anywhere") {
      beginning = `${pashtoWordBoundaryBeginning}[${pashtoCharacterRange}]*`; 
    }
  }
  return beginning;
}

function prepareEnding(options: FuzzifyOptions): string {
  let ending = "";
  if (options.matchWholeWordOnly) {
    ending = `(?![${pashtoCharacterRange}])`;
  } else if (options.returnWholeWord) {
    ending = `[${pashtoCharacterRange}]*(?![${pashtoCharacterRange}])`;
  }
  return ending;
}

function prepareFlags(options: FuzzifyOptions): string {
  return `m${options.globalMatch === false ? "" : "g"}`;
}

// Main function for returning a regular expression based on a string of Pashto text
export function fuzzifyPashto(input: string, options: FuzzifyOptions = {}): RegExp {
  const sanitizedInput = sanitizeInput(input, options);
  const mainRegexLogic = prepareMainRegexLogic(sanitizedInput, options);
  const beginning = prepareBeginning(options);
  const ending = prepareEnding(options);
  const flags = prepareFlags(options);
  return new RegExp(`${beginning}${mainRegexLogic}${ending}`, flags);
}

// Convienience function for testing if an environment supports lookbehind assertions
// Lookbehind assertions allow for cleaner word matching. 
// (Punctuation directly in fron of the word is ignored and there is no extra space)
export function es2018IsSupported(): boolean {
  let supported = true;
  try {
    // Test expression to see if environment supports lookbehind assertions
    const a = new RegExp("(?<!a)b");  
  } catch(error) {
    // Environment does not support lookbehind assertions in regex
    // Must ignore this line for testing, because not all environments can/will error here
    /* istanbul ignore next */ 
    supported = false;
  }
  return supported;
}
  