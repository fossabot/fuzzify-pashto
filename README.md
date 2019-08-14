# fuzzify-pashto

[![NPM](https://nodei.co/npm/fuzzify-pashto.png)](https://nodei.co/npm/fuzzify-pashto/)

[![Build Status](https://travis-ci.org/openpashto/fuzzify-pashto.svg?branch=master)](https://travis-ci.org/openpashto/fuzzify-pashto)

Converts Pashto text strings into Regex expressions for fuzzy searching. 

## Problem:

It can be difficult to search for words in Pashto texts or dictionaries because of variants or difficulties in spelling. This is because:

- Certain sounds in Pashto can be written with many different letters. This is true for Arabic and Farsi loan words.
    - For instance, the 'z' sound can be spelled with a any one of the folowing: ز ذ ض ظ.
- Certain sounds in Pashto can be difficult for non-native speakers to distinguish.
    - It may be hard for learners to hear the difference between the following pairs such as: ر/ړ څ/س ځ/ز
    - Along with this, in some dialects differences in the pronunciation of letters such as س and څ, or ښ and خ are lost.
- Spelling often changes based on dialect, area, and level of education. 
    - Some people may write "ګرځېدل" while others may write "گرزيدل"
    - While the proper dictionary form may be "څنګه", a learner may encounter the same word written as "سنگہ".

Because of all these reasons, it can be difficult to search for words based on sound, or a particular non-standard spelling.

## Solution:  

Search strings can be converted to Regex expressions that can be used for fuzzy searching so that, for example:

- A search for "گرزيدل" will match the word "ګرځېدل"  
- A search for "سنگہ" will match the word "څنګه"  
- A search for "انطزار" will match the word "انتظار" 
- A search for "د پاره" will match the word "دپاره" 
- **TODO:** A search for "له پاره" will match the word "لپاره" 

## Usage

```bash
npm install --save fuzzify-pashto
```

```node
const { fuzzifyPashto } = require("fuzzify-pashto");

const fuzzyRegex = fuzzifyPashto("سرک");
console.log(fuzzyRegex);

// /(^|[^\u0600-\u06FF])[صسثڅ][رړ][ګږکقگك]/mg
```

## API

### fuzzifyPashto.fuzzifyPashto(input, [options])

Takes an input of a string of Pashto text (usually a word), and returns a RegEx expression that can be used for fuzzy searching for approximate matches in Pashto text.

#### Options

##### options.begginingAt

Chooses where to allow matches in the string to start from

 - `"word"` **(default)** Matches starting only at the beginning of a Pashto word (This is like using `\\b...`, but with Pashto/Unicode functionality)
 - `"string"` Matches only starting at the very beginning of the string/text (`\^...\`)
 - `"anywhere"` Matches anywhere, from the beginning or middle of the words (`\...\`)

##### options.matchWholeWord
 - `false` **(default)** Will match the beginning or parts of words
 - `true` Will only match if the whole word is provided. This overrides `options.beginningAt = "anywhere"` if set. (This is like using `\\b...\b\` but with Pashto/Unicode functionality)

##### options.allowSpacesInWords
 - `false` **(default)** Mid-word spaces in either the search input or the text will break matches.
 - `true` Will match regardless of spaces, ie. `دپاره` will match `د پاره`, and vice versa.

##### options.singleMatchOnly
 - `false` **(default)** Returns a regex that will match all matches in a text (Include the `g` [flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags_2).)
 - `true` (Do not include the `g` [flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Advanced_searching_with_flags_2).)