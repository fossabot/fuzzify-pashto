# fuzzify-pashto

[![NPM](https://nodei.co/npm/fuzzify-pashto.png)](https://nodei.co/npm/fuzzify-pashto/)

[![Build Status](https://travis-ci.org/openpashto/fuzzify-pashto.svg?branch=master)](https://travis-ci.org/openpashto/fuzzify-pashto)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8ff024189134686af29bc707798ed73)](https://www.codacy.com/app/openpashto/fuzzify-pashto?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=openpashto/fuzzify-pashto&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/e8ff024189134686af29bc707798ed73)](https://www.codacy.com/app/openpashto/fuzzify-pashto?utm_source=github.com&utm_medium=referral&utm_content=openpashto/fuzzify-pashto&utm_campaign=Badge_Coverage)
[![Made with Typescript](https://img.shields.io/badge/Made%20with-Typescript-1f425f.svg)](https://www.typescriptlang.org/)

A JavaScript library that creates regular expressions (regex) for fuzzy 
searching Pashto text (approximate string matching).

[Website and Live Demo](https://www.openpashto.com/fuzzify-pashto)

## Problem

It can be difficult to search for words in Pashto texts or dictionaries because
 of variants or difficulties in spelling. This is because:

-   Certain sounds in Pashto can be written with many different letters. This 
is true for Arabic and Farsi loan words.  
    - For instance, the 'z' sound can be spelled with a any one of the 
following: ز ذ ض ظ.

-   Certain sounds in Pashto can be difficult for non-native speakers to 
distinguish.
    - It may be hard for learners to hear the difference between the following 
pairs such as: ر/ړ څ/س ځ/ز
    - Along with this, in some dialects differences in the pronunciation of 
letters such as س and څ, or ښ and خ are lost.

-   Spelling often changes based on dialect, area, and level of education.
    - Some people may write "ګرځېدل" while others may write "گرزيدل"
    - While the proper dictionary form may be "څنګه", a learner may 
encounter the same word written as "سنگہ".

Because of all these reasons, it can be difficult to search for words based on 
sound, or a particular non-standard spelling.

## Solution

Search strings can be converted to regular expressions that can be used for 
fuzzy searching so that, for example:

| Searching For | Will Match |
|---------------|------------|
| گرزيدل        | ګرځېدل     |
| سنگہ          | څنګه       |
| انطزار        | انتظار     |
| د پاره        | دپاره      |
| مالوم         | معلوم      |
| زبا           | ژبه        |
| سڑے           | سړی        |

and vice versa.

- **TODO:** A search for "له پاره" will match the word "لپاره"

## Usage

```bash
npm install --save fuzzify-pashto
```

```js
const { fuzzifyPashto } = require("fuzzify-pashto");

const fuzzyRegex = fuzzifyPashto("سرک");
console.log(fuzzyRegex);

// output: /(?:^|[^\u0621-\u065f\u0670-\u06d3\u06d5])?[صسثڅ]ع?[رړڑڼ]ع?[ګږکقگك]/gm
```

See the [Live Demo](https://www.openpashto.com/fuzzify-pashto) for up-to-date 
and interactive usage examples.

## API

### fuzzifyPashto.fuzzifyPashto(input, \[options\])

Takes an input of a string of Pashto text (usually a word), and returns a 
RegEx expression that can be used for fuzzy searching for approximate matches 
in Pashto text.

#### Options

##### options.matchStart

Chooses where to allow matches in the string to start from

-   `"word"` **(default)** Matches starting only at the beginning of a Pashto 
word (This is like using `\\b...`, but with Pashto/Unicode functionality) 

-   `"string"` Matches only starting at the very beginning of the string/text 
(`\^...\`) 

-   `"anywhere"` Matches anywhere, from the beginning or middle of the words 
(`\...\`) 

##### options.matchWholeWordOnly

-   `false` **(default)** Will match the beginning or parts of words  

-   `true` Will only match if the whole word is provided. This overrides 
`options.beginningAt = "anywhere"` if set. (This is like using `\\b...\b\` but 
with Pashto/Unicode functionality)

##### options.allowSpacesInWords

-   `false` **(default)** Mid-word spaces in either the search input or the 
text will break matches

-   `true` Will match regardless of spaces, ie. `دپاره` will match `د پاره`, 
and vice versa

##### options.JavaScript

- `"Pashto"` **(default)** Use Pashto script (پښټو)
- `"Latin"` Use Latin script (phonetics) (puxto)

##### options.returnWholeWord

- `false` **(default)** Will return just the matching characters
- `true` Will return the whole word attached to the matching characters  

##### opitons.es2018

-   `false` **(default)** Will not use [lookbehind assertions](https://v8.dev/blog/regexp-lookbehind-assertions) 
in regex because [they are not supported on every platform](https://caniuse.com/#feat=js-regexp-lookbehind)

-   `true` Only to be used with an environment like recent version of Chrome or 
Node.js, where lookbehind assertions [are supported](https://node.green/). 
This allows for cleaner matching of word beginnings, properly handling spaces 
and punctuation. **warning:** Do not use this if using in different, 
unsupported environments. It will cause a syntax error.

##### options.ignoreDiacritics

-   `false` **default** Diacritics will make or break matches

-   `true` Diacritics will be ignored, and matches will work regardless of 
whether or not they are included  
