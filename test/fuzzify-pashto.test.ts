import {
  fuzzifyPashto,
  es2018IsSupported,
} from '../src/fuzzify-pashto';

const defaultInfo = {
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

const withDiacritics = [
  ['تتتت', 'تِتّتّت'],
  ['بببب', 'بّبّبَب'],
];

const matchesWithAn = [
  ['حتمن', 'حتماً'],
  ['لتفن', 'لطفاً'],
  ['کاملا', 'کاملاً'],
]

const matchesWithSpaces = [
  ['دپاره', 'د پاره'],
  ['بېکار', 'بې کار'],
  ['د پاره', 'دپاره'],
  ['بې کار', 'بېکار'],
];

// Hacky interface needed for type issues in looping through optionsPossibilities
interface IOp {
  options?: { 
    matchStart?: "word" | "string" | "anywhere"; 
    allowSpacesInWords?: boolean;
    matchWholeWordOnly?: boolean;
  }
  viceVersaMatches?: boolean,
  matches?: any;
  nonMatches?: any;
}

const optionsPossibilities: Array<IOp> = [{
    options: undefined, // default
    ...defaultInfo,
    viceVersaMatches: true,
  },
  {
    options: {
      matchStart: "word",
    }, // same as default
    ...defaultInfo,
    viceVersaMatches: true,
  },
  {
    options: {
      allowSpacesInWords: true,
    },
    matches: [
      ...matchesWithSpaces,
    ],
    nonMatches: [],
    viceVersaMatches: true,
  },
  {
    options: {
      allowSpacesInWords: false,
    },
    matches: [],
    nonMatches: matchesWithSpaces,
  },
  {
    options: {
      matchStart: "anywhere",
    },
    matches: [
      ["کار", "بېکاري"],
    ],
    nonMatches: [
      ["سرک", "بېترک"],
    ],
  },
  {
    options: {
      matchWholeWordOnly: true,
    },
    matches: [
      ["کور", "کور"],
      ["سری", "سړی"],
    ],
    viceVersaMatches: true,
    nonMatches: [
      ["سړي", "سړيتوب"],
      ["کور", "کورونه"],
    ],
  },
  {
    options: {
      matchStart: "string",
    },
    matches: [
      ["کور", "کور ته ځم"],
      ["سری", "سړی دی"],
    ],
    nonMatches: [
      ["سړي", " سړيتوب"],
      ["کور", "خټين کورونه"],
    ],
  },
  {
    options: {
      matchStart: "string",
    },
    matches: [
      ["کور", "کور ته ځم"],
      ["سری", "سړی دی"],
    ],
    nonMatches: [
      ["سړي", " سړيتوب"],
      ["کور", "خټين کورونه"],
    ],
  },
];

const punctuationToExclude = [
  "،", "؟", "؛", "۔", "۲", "۹", "۰", "»", "«", "٫", "!", ".", "؋", "٪", "٬", "×", ")", "(", " ",
  "\t",
];

optionsPossibilities.forEach(o => {
  console.log(o.options);
  o.matches.forEach(m => {
    test(`${m[0]} should match ${m[1]}`, () => {
      const re = fuzzifyPashto(m[0], o.options);
      const result = m[1].match(re);
      expect(result).toBeTruthy();
    });
  });
  if (o.viceVersaMatches === true) {
    o.matches.forEach(m => {
      test(`${m[1]} should match ${m[0]}`, () => {
        const re = fuzzifyPashto(m[1], undefined);
        const result = m[0].match(re);
        expect(result).toBeTruthy();
      });
    });
  }
  o.nonMatches.forEach(m => {
    test(`${m[0]} should not match ${m[1]}`, () => {
      const re = fuzzifyPashto(m[0], undefined);
      const result = m[1].match(re);
      expect(result).toBeNull();
    });
  });
});

matchesWithAn.forEach(m => {
  test(`matching ${m[0]} should work with ${m[1]}`, () => {
    const re = fuzzifyPashto(m[0], {
      matchWholeWordOnly: true,
    });
    const result = m[1].match(re);
    expect(result).toBeTruthy();
  });
  test(`matching ${m[1]} should work with ${m[0]}`, () => {
    const re = fuzzifyPashto(m[1], {
      matchWholeWordOnly: true,
    });
    const result = m[0].match(re);
    expect(result).toBeTruthy();
  });
});

withDiacritics.forEach(m => {
  test(`matich ${m[0]} should ignore the diactritics in ${m[1]}`, () => {
    const re = fuzzifyPashto(m[0], {
      ignoreDiacritics: true,
    });
    const result = m[1].match(re);
    expect(result).toBeTruthy();
  });
  test(`the diacritics should in ${m[0]} should be ignored when matching with ${m[1]}`, () => {
    const re = fuzzifyPashto(m[1], {
      ignoreDiacritics: true,
    });
    const result = m[0].match(re);
    expect(result).toBeTruthy();
  });
});


test(`وs should be optional if entered in search string`, () => {
  const re = fuzzifyPashto("لوتفن");
  const result = "لطفاً".match(re);
  expect(result).toBeTruthy();
});

test(`With globalMatch set to false should only return one match`, () => {
  // Need to do beginning at "string" because the beginning at "word" can create an extra space making an empty value in the result
  // Don't know how to get around this without lookbehinds in javascript regex
  const re = fuzzifyPashto("ته", {
    globalMatch: false,
    matchStart: "string",
  });
  const result = "ته کله کلي ته ځې؟".match(re);
  expect(result).toHaveLength(1)
});

test(`With globalMatch set to true should return many matches`, () => {
  const re = fuzzifyPashto("ته", {
    globalMatch: true,
  });
  const result = "ته کله کلي ته ځې؟".match(re);
  expect(result).toHaveLength(2)
});

test(`globalMatch should be set to true by default`, () => {
  const re = fuzzifyPashto("ته");
  const result = "ته کله کلي ته ځې؟".match(re);
  expect(result).toHaveLength(2)
});

test(`Should return many matches`, () => {
  const re = fuzzifyPashto("کار", {
    globalMatch: true,
    matchStart: "anywhere",
  });
  const result = "کار کوه، بېکاره مه ګرځه".match(re);
  expect(result).toHaveLength(2);
});

test(`matchWholeWordOnly should override matchStart = "anywhere"`, () => {
  const re = fuzzifyPashto("کار", {
    matchWholeWordOnly: true,
    matchStart: "anywhere",
  });
  const result = "کار کوه، بېکاره مه ګرځه".match(re);
  expect(result).toHaveLength(1);
  expect(result).toEqual(expect.not.arrayContaining(["بېکاره"]));
});


test(`returnWholeWord should return the whole word`, () => {
  const re = fuzzifyPashto("کار", {
    returnWholeWord: true,
  });
  const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
  expect(result).toHaveLength(1);
  expect(result).toContain("کارونه");
});

punctuationToExclude.forEach(m => {
  test(`${m} should not be considered part of a Pashto word`, () => {
    const re = fuzzifyPashto("کور", {
      returnWholeWord: true,
      matchStart: "word",
    });
    // ISSUE: This should also work when the word is PRECEDED by the punctuation
    // Need to work with a lookbehind equivalent
    const result = `زمونږ کورونه${m} دي`.match(re);
    expect(result).toHaveLength(1);
    expect(result).toContain(" کورونه");
    // Matches will unfortunately have a space on the front of the word, issue with missing es2018 lookbehinds
  });
});

punctuationToExclude.forEach(m => {
  test(
    `${m} should not be considered part of a Pashto word (front or back with es2018) - or should fail if using a non es2018 environment`,
    () => {
      // tslint:disable-next-line
      let result: any;
      let failed = false;
      // if environment is not es2018 with lookbehind support (like node 6, 8) this will fail
      try {
        const re = fuzzifyPashto("کور", {
          returnWholeWord: true,
          matchStart: "word",
          es2018: true,
        });
        result = `زمونږ ${m}کورونه${m} دي`.match(re);
      } catch (error) {
        failed = true;
      }
      const worked = failed || (result.length === 1 && result.includes("کورونه"));
      expect(worked).toBe(true);
    });
});

test(`Arabic punctuation or numbers should not be considered part of a Pashto word`, () => {
  const re = fuzzifyPashto("کار", {
    returnWholeWord: true,
  });
  const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
  expect(result).toHaveLength(1);
  expect(result).toContain("کارونه");
});

test(`returnWholeWord should return the whole word even when starting the matching in the middle`,
() => {
  const re = fuzzifyPashto("کار", {
    returnWholeWord: true,
    matchStart: "anywhere",
  });
  const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
  expect(result).toHaveLength(2);
  expect(result).toContain(" بېکاره");
});

test(`returnWholeWord should should not return partial matches if matchWholeWordOnly is true`,
() => {
  const re = fuzzifyPashto("کار", {
    returnWholeWord: true,
    matchStart: "anywhere",
    matchWholeWordOnly: true,
  });
  const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
  expect(result).toBeNull();
});

test(`es2018isSuppported should either return true or false`, () => {
  const answer = es2018IsSupported();
  expect(typeof answer).toBe("boolean");
});
