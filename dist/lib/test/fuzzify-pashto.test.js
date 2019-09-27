"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var fuzzify_pashto_1 = require("../src/fuzzify-pashto");
var defaultInfo = {
    matches: [
        ["سرک", "صړق"],
        ["انطذاړ", "انتظار"],
        ["مالوم", "معلوم"],
        ["معلوم", "مالوم"],
        ["قېصا", "کيسه"],
        ["کور", "قوړ"],
        ["گرزيدل", "ګرځېدل"],
        ["سنگہ", "څنګه"],
        ["کار", "قهر"],
        ["زبا", "ژبه"],
        ["سڑے", "سړی"],
        ["استمال", "استعمال"],
        ["اعمل", "عمل"],
        ["جنگل", "ځنګل"],
        ["ځال", "جال"],
        ["زنگل", "ځنګل"],
        ["جرل", "ژړل"],
    ],
    nonMatches: [
        ["سرک", "ترک"],
        ["کار", "بېکاري"],
    ],
};
var defaultLatinInfo = {
    matches: [
        ["lootfun", "lUtfan"],
        ["sarey", "saRey"],
        ["senga", "tsanga"],
        ["daktur", "DakTar"],
        ["iteebar", "itibaar"],
        ["dzaal", "jaal"],
        ["bekaar", "bekáar"],
        ["bekár", "bekaar"],
        ["chaai", "cháai"],
        ["day", "daai"],
        ["dai", "dey"],
        ["daktar", "Daktár"],
        ["sarái", "saRey"],
        ["beter", "bahtár"],
        ["doosti", "dostee"],
        ["dar", "dăr"],
        ["der", "dăr"],
        ["dur", "dăr"],
        ["chee", "che"],
        ["dzooy", "zooy"],
        ["delta", "dalta"],
        ["koorbaani", "qUrbaanee"],
        ["fermaai", "farmaayee"],
    ],
    nonMatches: [
        ["kor", "por"],
        ["intizaar", "intizaam"],
    ],
};
var withDiacritics = [
    ["تتتت", "تِتّتّت"],
    ["بببب", "بّبّبَب"],
];
var matchesWithAn = [
    ["حتمن", "حتماً"],
    ["لتفن", "لطفاً"],
    ["کاملا", "کاملاً"],
];
var matchesWithSpaces = [
    ["دپاره", "د پاره"],
    ["بېکار", "بې کار"],
    ["د پاره", "دپاره"],
    ["بې کار", "بېکار"],
];
var matchesWithSpacesLatin = [
    ["dupaara", "du paara"],
    ["bekaara", "be kaara"],
    ["du paara", "dupaara"],
    ["be kaara", "bekaara"],
];
var optionsPossibilities = [
    __assign({ options: {} }, defaultInfo, { viceVersaMatches: true }),
    __assign({ options: { script: "Latin" } }, defaultLatinInfo, { viceVersaMatches: false }),
    __assign({ options: { matchStart: "word" } }, defaultInfo, { viceVersaMatches: true }),
    {
        matches: matchesWithSpaces.slice(),
        nonMatches: [],
        options: { allowSpacesInWords: true },
        viceVersaMatches: true,
    },
    {
        matches: matchesWithSpacesLatin.slice(),
        nonMatches: [],
        options: { allowSpacesInWords: true, script: "Latin" },
        viceVersaMatches: true,
    },
    {
        matches: [],
        nonMatches: matchesWithSpaces,
        options: { allowSpacesInWords: false },
    },
    {
        matches: [],
        nonMatches: matchesWithSpacesLatin,
        options: { allowSpacesInWords: false, script: "Latin" },
    },
    {
        matches: [
            ["کار", "بېکاري"],
        ],
        nonMatches: [
            ["سرک", "بېترک"],
        ],
        options: { matchStart: "anywhere" },
    },
    {
        matches: [
            ["کور", "کور"],
            ["سری", "سړی"],
        ],
        nonMatches: [
            ["سړي", "سړيتوب"],
            ["کور", "کورونه"],
        ],
        options: { matchWholeWordOnly: true },
        viceVersaMatches: true,
    },
    {
        matches: [
            ["کور", "کور ته ځم"],
            ["سری", "سړی دی"],
        ],
        nonMatches: [
            ["سړي", " سړيتوب"],
            ["کور", "خټين کورونه"],
        ],
        options: { matchStart: "string" },
    },
    {
        matches: [
            ["کور", "کور ته ځم"],
            ["سری", "سړی دی"],
        ],
        nonMatches: [
            ["سړي", " سړيتوب"],
            ["کور", "خټين کورونه"],
        ],
        options: { matchStart: "string" },
    },
];
var punctuationToExclude = [
    "،", "؟", "؛", "۔", "۲", "۹", "۰", "»", "«", "٫", "!", ".", "؋", "٪", "٬", "×", ")", "(", " ", "\t",
];
optionsPossibilities.forEach(function (o) {
    o.matches.forEach(function (m) {
        test(m[0] + " should match " + m[1], function () {
            var re = fuzzify_pashto_1.fuzzifyPashto(m[0], o.options);
            // eslint-disable-next-line
            var result = m[1].match(new RegExp(re));
            expect(result).toBeTruthy();
        });
    });
    if (o.viceVersaMatches === true) {
        o.matches.forEach(function (m) {
            test(m[1] + " should match " + m[0], function () {
                var re = fuzzify_pashto_1.fuzzifyPashto(m[1], o.options);
                // eslint-disable-next-line
                var result = m[0].match(new RegExp(re));
                expect(result).toBeTruthy();
            });
        });
    }
    o.nonMatches.forEach(function (m) {
        test(m[0] + " should not match " + m[1], function () {
            var re = fuzzify_pashto_1.fuzzifyPashto(m[0], o.options);
            // eslint-disable-next-line
            var result = m[1].match(new RegExp(re));
            expect(result).toBeNull();
        });
    });
});
matchesWithAn.forEach(function (m) {
    test("matching " + m[0] + " should work with " + m[1], function () {
        var re = fuzzify_pashto_1.fuzzifyPashto(m[0], { matchWholeWordOnly: true });
        // eslint-disable-next-line
        var result = m[1].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
    test("matching " + m[1] + " should work with " + m[0], function () {
        var re = fuzzify_pashto_1.fuzzifyPashto(m[1], { matchWholeWordOnly: true });
        // eslint-disable-next-line
        var result = m[0].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
});
withDiacritics.forEach(function (m) {
    test("matich " + m[0] + " should ignore the diactritics in " + m[1], function () {
        var re = fuzzify_pashto_1.fuzzifyPashto(m[0], { ignoreDiacritics: true });
        // eslint-disable-next-line
        var result = m[1].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
    test("the diacritics should in " + m[0] + " should be ignored when matching with " + m[1], function () {
        var re = fuzzify_pashto_1.fuzzifyPashto(m[1], { ignoreDiacritics: true });
        // eslint-disable-next-line
        var result = m[0].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
});
test("\u0648s should be optional if entered in search string", function () {
    var re = fuzzify_pashto_1.fuzzifyPashto("لوتفن");
    // eslint-disable-next-line
    var result = "لطفاً".match(new RegExp(re));
    expect(result).toBeTruthy();
});
test("matchWholeWordOnly should override matchStart = \"anywhere\"", function () {
    var re = fuzzify_pashto_1.fuzzifyPashto("کار", { matchWholeWordOnly: true, matchStart: "anywhere" });
    // eslint-disable-next-line
    var result = "کار کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toHaveLength(1);
    expect(result).toEqual(expect.not.arrayContaining(["بېکاره"]));
});
test("returnWholeWord should return the whole word", function () {
    // With Pashto Script
    var re = fuzzify_pashto_1.fuzzifyPashto("کار", { returnWholeWord: true });
    // eslint-disable-next-line
    var result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toHaveLength(1);
    expect(result).toContain("کارونه");
    // With Latin Script
    var reLatin = fuzzify_pashto_1.fuzzifyPashto("kaar", {
        returnWholeWord: true,
        script: "Latin",
    });
    // eslint-disable-next-line
    var resultLatin = "kaaroona kawa, bekaara ma gurdza.".match(new RegExp(reLatin));
    expect(resultLatin).toHaveLength(1);
    expect(resultLatin).toContain("kaaroona");
});
test("returnWholeWord should return the whole word even when starting the matching in the middle", function () {
    // With Pashto Script
    var re = fuzzify_pashto_1.fuzzifyPashto("کار", { returnWholeWord: true, matchStart: "anywhere" });
    // eslint-disable-next-line
    var result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re, "g"));
    expect(result).toHaveLength(2);
    expect(result).toContain(" بېکاره");
    // With Latin Script
    var reLatin = fuzzify_pashto_1.fuzzifyPashto("kaar", {
        matchStart: "anywhere",
        returnWholeWord: true,
        script: "Latin",
    });
    // eslint-disable-next-line
    var resultLatin = "kaaroona kawa bekaara ma gurdza".match(new RegExp(reLatin, "g"));
    expect(resultLatin).toHaveLength(2);
    expect(resultLatin).toContain("bekaara");
});
test("returnWholeWord should should not return partial matches if matchWholeWordOnly is true", function () {
    // With Pashto Script
    var re = fuzzify_pashto_1.fuzzifyPashto("کار", { returnWholeWord: true, matchStart: "anywhere", matchWholeWordOnly: true });
    // eslint-disable-next-line
    var result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toBeNull();
    // With Latin Script
    var reLatin = fuzzify_pashto_1.fuzzifyPashto("kaar", {
        matchStart: "anywhere",
        matchWholeWordOnly: true,
        returnWholeWord: true,
        script: "Latin",
    });
    // eslint-disable-next-line
    var resultLatin = "kaaroona kawa bekaara ma gurdza".match(new RegExp(reLatin));
    expect(resultLatin).toBeNull();
});
punctuationToExclude.forEach(function (m) {
    test(m + " should not be considered part of a Pashto word", function () {
        var re = fuzzify_pashto_1.fuzzifyPashto("کور", { returnWholeWord: true, matchStart: "word" });
        // ISSUE: This should also work when the word is PRECEDED by the punctuation
        // Need to work with a lookbehind equivalent
        // eslint-disable-next-line
        var result = ("\u0632\u0645\u0648\u0646\u0696 \u06A9\u0648\u0631\u0648\u0646\u0647" + m + " \u062F\u064A").match(new RegExp(re));
        expect(result).toHaveLength(1);
        expect(result).toContain(" کورونه");
        // Matches will unfortunately have a space on the front of the word, issue with missing es2018 lookbehinds
    });
});
punctuationToExclude.forEach(function (m) {
    // tslint:disable-next-line
    test(m + " should not be considered part of a Pashto word (front or back with es2018) - or should fail if using a non es2018 environment", function () {
        var result;
        var failed = false;
        // if environment is not es2018 with lookbehind support (like node 6, 8) this will fail
        try {
            var re = fuzzify_pashto_1.fuzzifyPashto("کور", { returnWholeWord: true, matchStart: "word", es2018: true });
            // eslint-disable-next-line
            result = ("\u0632\u0645\u0648\u0646\u0696 " + m + "\u06A9\u0648\u0631\u0648\u0646\u0647" + m + " \u062F\u064A").match(new RegExp(re));
        }
        catch (error) {
            failed = true;
        }
        var worked = failed || (result.length === 1 && result.includes("کورونه"));
        expect(worked).toBe(true);
    });
});
test("Arabic punctuation or numbers should not be considered part of a Pashto word", function () {
    var re = fuzzify_pashto_1.fuzzifyPashto("کار", { returnWholeWord: true });
    // eslint-disable-next-line
    var result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toHaveLength(1);
    expect(result).toContain("کارونه");
});
//# sourceMappingURL=fuzzify-pashto.test.js.map