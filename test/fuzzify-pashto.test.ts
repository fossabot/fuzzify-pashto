import { fuzzifyPashto } from "../src/fuzzify-pashto";
import { IFuzzifyOptions } from "../src/types";

type match = [string, string];
interface IDefaultInfoBlock {
    matches: match[];
    nonMatches: match[];
}

const defaultInfo: IDefaultInfoBlock = {
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

const defaultLatinInfo: IDefaultInfoBlock = {
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

const withDiacritics: match[] = [
    ["تتتت", "تِتّتّت"],
    ["بببب", "بّبّبَب"],
];

const matchesWithAn: match[] = [
    ["حتمن", "حتماً"],
    ["لتفن", "لطفاً"],
    ["کاملا", "کاملاً"],
];

const matchesWithSpaces: match[] = [
    ["دپاره", "د پاره"],
    ["بېکار", "بې کار"],
    ["د پاره", "دپاره"],
    ["بې کار", "بېکار"],
];

const matchesWithSpacesLatin: match[] = [
    ["dupaara", "du paara"],
    ["bekaara", "be kaara"],
    ["du paara", "dupaara"],
    ["be kaara", "bekaara"],
];

interface ITestOptions {
  options: IFuzzifyOptions;
  matches?: any;
  nonMatches?: any;
  viceVersaMatches?: any;
}

const optionsPossibilities: ITestOptions[] = [
    {
        options: {}, // default
        ...defaultInfo,
        viceVersaMatches: true,
    },
    {
        options: { script: "Latin" },
        ...defaultLatinInfo,
        viceVersaMatches: false,
    },
    {
        options: {matchStart: "word"}, // same as default
        ...defaultInfo,
        viceVersaMatches: true,
    },
    {
        matches: [
            ...matchesWithSpaces,
        ],
        nonMatches: [],
        options: {allowSpacesInWords: true},
        viceVersaMatches: true,
    },
    {
        matches: [
            ...matchesWithSpacesLatin,
        ],
        nonMatches: [],
        options: {allowSpacesInWords: true, script: "Latin"},
        viceVersaMatches: true,
    },
    {
        matches: [],
        nonMatches: matchesWithSpaces,
        options: {allowSpacesInWords: false},
    },
    {
        matches: [],
        nonMatches: matchesWithSpacesLatin,
        options: {allowSpacesInWords: false, script: "Latin"},
    },
    {
        matches: [
            ["کار", "بېکاري"],
        ],
        nonMatches: [
            ["سرک", "بېترک"],
        ],
        options: {matchStart: "anywhere"},
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
        options: {matchWholeWordOnly: true},
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
        options: {matchStart: "string"},
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
        options: {matchStart: "string"},
    },
];

const punctuationToExclude = [
    "،", "؟", "؛", "۔", "۲", "۹", "۰", "»", "«", "٫", "!", ".", "؋", "٪", "٬", "×", ")", "(", " ", "\t",
];

optionsPossibilities.forEach((o) => {
    o.matches.forEach((m: any) => {
        test(`${m[0]} should match ${m[1]}`, () => {
            const re = fuzzifyPashto(m[0], o.options);
            // eslint-disable-next-line
            const result = m[1].match(new RegExp(re));
            expect(result).toBeTruthy();
        });
    });
    if (o.viceVersaMatches === true) {
        o.matches.forEach((m: any) => {
            test(`${m[1]} should match ${m[0]}`, () => {
                const re = fuzzifyPashto(m[1], o.options);
                // eslint-disable-next-line
                const result = m[0].match(new RegExp(re));
                expect(result).toBeTruthy();
            });
        });
    }
    o.nonMatches.forEach((m: any) => {
        test(`${m[0]} should not match ${m[1]}`, () => {
            const re = fuzzifyPashto(m[0], o.options);
            // eslint-disable-next-line
            const result = m[1].match(new RegExp(re));
            expect(result).toBeNull();
        });
    });
});

matchesWithAn.forEach((m: any) => {
    test(`matching ${m[0]} should work with ${m[1]}`, () => {
        const re = fuzzifyPashto(m[0], { matchWholeWordOnly: true });
        // eslint-disable-next-line
        const result = m[1].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
    test(`matching ${m[1]} should work with ${m[0]}`, () => {
        const re = fuzzifyPashto(m[1], { matchWholeWordOnly: true });
        // eslint-disable-next-line
        const result = m[0].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
});

withDiacritics.forEach((m: any) => {
    test(`matich ${m[0]} should ignore the diactritics in ${m[1]}`, () => {
        const re = fuzzifyPashto(m[0], { ignoreDiacritics: true });
        // eslint-disable-next-line
        const result = m[1].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
    test(`the diacritics should in ${m[0]} should be ignored when matching with ${m[1]}`, () => {
        const re = fuzzifyPashto(m[1], { ignoreDiacritics: true });
        // eslint-disable-next-line
        const result = m[0].match(new RegExp(re));
        expect(result).toBeTruthy();
    });
});

test(`وs should be optional if entered in search string`, () => {
    const re = fuzzifyPashto("لوتفن");
    // eslint-disable-next-line
    const result = "لطفاً".match(new RegExp(re));
    expect(result).toBeTruthy();
});

test(`matchWholeWordOnly should override matchStart = "anywhere"`, () => {
    const re = fuzzifyPashto("کار", { matchWholeWordOnly: true, matchStart: "anywhere" });
    // eslint-disable-next-line
    const result = "کار کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toHaveLength(1);
    expect(result).toEqual(expect.not.arrayContaining(["بېکاره"]));
});

test(`returnWholeWord should return the whole word`, () => {
    // With Pashto Script
    const re = fuzzifyPashto("کار", { returnWholeWord: true });
    // eslint-disable-next-line
    const result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toHaveLength(1);
    expect(result).toContain("کارونه");
    // With Latin Script
    const reLatin = fuzzifyPashto("kaar", {
        returnWholeWord: true,
        script: "Latin",
    });
    // eslint-disable-next-line
    const resultLatin = "kaaroona kawa, bekaara ma gurdza.".match(new RegExp(reLatin));
    expect(resultLatin).toHaveLength(1);
    expect(resultLatin).toContain("kaaroona");
});

test(`returnWholeWord should return the whole word even when starting the matching in the middle`, () => {
    // With Pashto Script
    const re = fuzzifyPashto("کار", { returnWholeWord: true, matchStart: "anywhere" });
    // eslint-disable-next-line
    const result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re, "g"));
    expect(result).toHaveLength(2);
    expect(result).toContain(" بېکاره");

    // With Latin Script
    const reLatin = fuzzifyPashto("kaar", {
        matchStart: "anywhere",
        returnWholeWord: true,
        script: "Latin",
    });
    // eslint-disable-next-line
    const resultLatin = "kaaroona kawa bekaara ma gurdza".match(new RegExp(reLatin, "g"));
    expect(resultLatin).toHaveLength(2);
    expect(resultLatin).toContain("bekaara");
});

test(`returnWholeWord should should not return partial matches if matchWholeWordOnly is true`, () => {
    // With Pashto Script
    const re = fuzzifyPashto("کار", { returnWholeWord: true, matchStart: "anywhere", matchWholeWordOnly: true });
    // eslint-disable-next-line
    const result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toBeNull();

    // With Latin Script
    const reLatin = fuzzifyPashto("kaar", {
        matchStart: "anywhere",
        matchWholeWordOnly: true,
        returnWholeWord: true,
        script: "Latin",
    });
    // eslint-disable-next-line
    const resultLatin = "kaaroona kawa bekaara ma gurdza".match(new RegExp(reLatin));
    expect(resultLatin).toBeNull();
});

punctuationToExclude.forEach((m) => {
    test(`${m} should not be considered part of a Pashto word`, () => {
        const re = fuzzifyPashto("کور", { returnWholeWord: true, matchStart: "word" });
        // ISSUE: This should also work when the word is PRECEDED by the punctuation
        // Need to work with a lookbehind equivalent
        // eslint-disable-next-line
        const result = `زمونږ کورونه${m} دي`.match(new RegExp(re));
        expect(result).toHaveLength(1);
        expect(result).toContain(" کورونه");
        // Matches will unfortunately have a space on the front of the word, issue with missing es2018 lookbehinds
    });
});

punctuationToExclude.forEach((m) => {
    // tslint:disable-next-line
    test(`${m} should not be considered part of a Pashto word (front or back with es2018) - or should fail if using a non es2018 environment`, () => {
        let result: any;
        let failed = false;
        // if environment is not es2018 with lookbehind support (like node 6, 8) this will fail
        try {
            const re = fuzzifyPashto("کور", { returnWholeWord: true, matchStart: "word", es2018: true });
            // eslint-disable-next-line
            result = `زمونږ ${m}کورونه${m} دي`.match(new RegExp(re));
        } catch (error) {
            failed = true;
        }
        const worked = failed || (result.length === 1 && result.includes("کورونه"));
        expect(worked).toBe(true);
    });
});

test(`Arabic punctuation or numbers should not be considered part of a Pashto word`, () => {
    const re = fuzzifyPashto("کار", { returnWholeWord: true });
    // eslint-disable-next-line
    const result = "کارونه کوه، بېکاره مه ګرځه".match(new RegExp(re));
    expect(result).toHaveLength(1);
    expect(result).toContain("کارونه");
});
