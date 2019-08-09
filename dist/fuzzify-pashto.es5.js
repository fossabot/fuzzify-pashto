// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
var sSounds = "[ص س ث څ]";
var zSounds = "[ز ض ظ ذ ځ]";
var tdSounds = "[ط ت ټ د ډ]";
var velarPlosives = "[ګ ږ ک ق گ ك]";
var labialPlosivesAndFricatives = "[ف پ ب]";
// Includes Arabic ى \u0649
var theFiveYeys = "[ې ۍ ی ي ئ ے ى]";
// TODO: Deal with diacritics etc.
// .replace(/[\u0600-\u061e\u064c-\u0670\u06D6-\u06Ed]/g, '');
var pashtoReplacer = {
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
};
var thingsToReplace = Object.keys(pashtoReplacer);
var pashtoReplacerRegex = new RegExp(thingsToReplace.reduce(function (accumulator, currentValue, i) {
    if (i === thingsToReplace.length - 1) {
        return accumulator + currentValue;
    }
    return accumulator + currentValue + "|";
}, ""), "g");
function fuzzifyPashto(input) {
    var regexLogic = input.trim().replace(pashtoReplacerRegex, function (mtch) { return pashtoReplacer[mtch]; });
    // TODO: Do beginning of word re: https://stackoverflow.com/questions/40731058/regex-match-arabic-keyword
    return new RegExp('^' + regexLogic, '');
}

export { fuzzifyPashto };
//# sourceMappingURL=fuzzify-pashto.es5.js.map
