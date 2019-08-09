# fuzzify-pashto

[![Build Status](https://travis-ci.org/openpashto/fuzzify-pashto.svg?branch=master)](https://travis-ci.org/openpashto/fuzzify-pashto)

Converts Pashto text strings into Regex expressions for fuzzy searching. 

### Problem:

It can be difficult to search for words in Pashto dictionaries or text because of differences or difficulties in spelling. This is because:

- Certain sounds in Pashto can be written with many different letters. This is true for Arabic and Farsi loan words.
    - For instance, the 'z' sound can be spelled with a any one of the folowing: ز ذ ض ظ.
- Certain sounds in Pashto can be difficult for non-native speakers to distinguish.
    - For instance, it may be hard for learners to hear the difference between the following pairs: (ز - ځ), (څ - س), (ر - ړ)
    - Along with this, in some dialects differences in the pronunciation of letters such as س and څ are lost.
- Spelling often changes based on dialect, area, and level of education. 
    - Some people may write "ګرځېدل" while others may write "گرزيدل"
    - While the proper dictionary form may be "څنګه", a learner may encounter the same word written as "سنگہ".

Because of all these reasons, it can be difficult to search for words based on sound, or a particular non-standard spelling.

### Solution:  

Search strings can be converted to Regex expressions that can be used for fuzzy searching so that:

- A search for "گرزيدل" will match the word "ګرځېدل"  
- A search for "سنگہ" will match the word "څنګه"  
- A search for "انطزار" will match the word "انتظار"  

## Usage

```
npm install --save fuzzify-pashto
```

```
const { fuzzifyPashto } = require("fuzzify-pashto");

const fuzzyRegex = fuzzifyPashto("سرک");
console.log(fuzzyRegex);

// /^[ص س ث څ][ر ړ][ګ ږ ک ق گ]/
```
