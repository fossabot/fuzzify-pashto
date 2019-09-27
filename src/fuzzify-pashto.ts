/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { pashtoReplacerRegex, pashtoReplacerInfo } from "./replacer";
import { IFuzzifyOptions } from "./types";

export const pashtoCharacterRange = "\u0621-\u065f\u0670-\u06d3\u06d5";
// Unfortunately, without ES2018 lookbehind assertions word boundary matching is not as clean
// Without lookbehind assertions, we are unable to ignore punctuation directly in front of a word
// and matching results include a space before the word
export const pashtoWordBoundaryBeginning = `(?:^|[^${pashtoCharacterRange}])`;
// These problems are solved by using the ES2018 lookbehind assertions where environments permit
export const pashtoWordBoundaryBeginningWithES2018 = `(?<![${pashtoCharacterRange}])`;
const diacritics = "\u064b-\u065f\u0670\u0674"; // pretty generous diactritic range

function sanitizeInput(input: string, options: IFuzzifyOptions): string {
  let safeInput = input.trim().replace(/[#-.]|[[-^]|[?|{}]/g, "");
  if (options.allowSpacesInWords) {
    safeInput = safeInput.replace(/ /g, "");
  }
  if (options.ignoreDiacritics) {
    safeInput = safeInput.replace(new RegExp(`[${diacritics}]`, "g"), "");
  }
  return safeInput;
}

// TODO: make across files
type replacerItem = { 
  char: string, 
  range: string, 
  plus?: string[],
  ignorable?: boolean, 
}

function prepareMainRegexLogic(sanitizedInput: string, options: IFuzzifyOptions): string {
  return sanitizedInput.replace(pashtoReplacerRegex, (mtch) => {
    const r = pashtoReplacerInfo.find((x) => x.char === mtch);
    let section = `[${r && r.range}]`;
    if (r && r.plus) {
      const additionalOptionGroups = r.plus.join("|");
      section = `(?:${section}|${additionalOptionGroups})`;
    }
    return `${section}${r && r.ignorable ? "?" : ""}ع?${options.ignoreDiacritics ? `[${diacritics}]?`: ""}${options.allowSpacesInWords ? "\ ?" : ""}`;
  });
}

function getBeginningWithAnywhere(options: IFuzzifyOptions): string {
  // Override the "anywhere" when matchWholeWordOnly is true
  if (options.matchWholeWordOnly) {
    return pashtoWordBoundaryBeginning;
  } 
  if (options.returnWholeWord) {
    // Return the whole world even if matching from the middle (if desired)
    return `${pashtoWordBoundaryBeginning}[${pashtoCharacterRange}]*`; 
  }
  return "";
}

function prepareBeginning(options: IFuzzifyOptions): string {
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

function prepareEnding(options: IFuzzifyOptions): string {
  if (options.matchWholeWordOnly) {
    return `(?![${pashtoCharacterRange}])`;
  }
  if (options.returnWholeWord) {
    return `[${pashtoCharacterRange}]*(?![${pashtoCharacterRange}])`;
  }
  return "";
}

// Main function for returning a regular expression based on a string of Pashto text
export function fuzzifyPashto(input: string, options: IFuzzifyOptions = {}): string {
  const sanitizedInput = sanitizeInput(input, options);
  const mainRegexLogic = prepareMainRegexLogic(sanitizedInput, options);
  const beginning = prepareBeginning(options);
  const ending = prepareEnding(options);
  return `${beginning}${mainRegexLogic}${ending}`;
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

