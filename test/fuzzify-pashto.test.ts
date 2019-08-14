import { fuzzifyPashto } from '../src/fuzzify-pashto';

const defaultInfo = {
	matches: [
		["سرک", "صړق"],
		["انطذاړ", "انتظار"],
		["مالوم", "معلوم"],
		["معلوم", "مالوم"],
		["قېصا", "کيسه"],
		["کور", "قورونه"],
		["گرزيدل", "ګرځېدل"],
		["سنگہ", "څنګه"],
		["کار", "بې کاري"],
		["زبا", "ژبه"],
	],
	nonMatches: [
		["سرک", "ترک"],
		["کار", "بېکاري"],
	],
};

const matchesWithSpaces = [
	['دپاره', 'د پاره'],
	['بېکار', 'بې کار'],
	['د پاره', 'دپاره'],
	['بې کار', 'بېکار',],
];

const optionsPossibilities = [
	{
		options: {}, // default
		...defaultInfo,
	},
	{
		options: {beginningAt: "word"}, // same as default
		...defaultInfo,
	},
	{
		options: {allowSpacesInWords: true},
		matches: [
			...matchesWithSpaces,
			["دپاره", "دپاره"], // should also work without spaces
		],
		nonMatches: [],
	},
	{
		options: {allowSpacesInWords: false},
		matches: [],
		nonMatches: matchesWithSpaces,
	},
	{
		options: {beginningAt: "anywhere"},
		matches: [
			["کار", "بېکاري"],
		],
		nonMatches: [
			["سرک", "بېترک"],
		],
	},
	{
		options: {matchWholeWordOnly: true},
		matches: [
			["کور", "کور"],
			["سری", "سړی"],
		],
		nonMatches: [
			["سړي", "سړيتوب"],
			["کور", "کورونه"],
		],
	},
	{
		options: {beginningAt: "string"},
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
		options: {beginningAt: "string"},
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

optionsPossibilities.forEach(o => {
	o.matches.forEach(m => {
		test(`${m[0]} should match ${m[1]}`, () => {
			const re = fuzzifyPashto(m[0], o.options);
			const result = m[1].match(re);
			expect(result).toBeTruthy();
		});
	});
	o.nonMatches.forEach(m => {
		test(`${m[0]} should not match ${m[1]}`, () => {
			const re = fuzzifyPashto(m[0], o.options);
			const result = m[1].match(re);
			expect(result).toBeNull();
		});
	});
})

test(`Should only return one match`, () => {
	// Need to do beginning at "string" because the beginning at "word" can create an extra space making an empty value in the result
	// Don't know how to get around this without lookbehinds in javascript
	const re = fuzzifyPashto("ته", { singleMatchOnly: true, beginningAt: "string" });
	const result = "ته کله کلي ته ځې؟".match(re);
	expect(result).toHaveLength(1)
});

test(`Should return many matches`, () => {
	const re = fuzzifyPashto("ته", { singleMatchOnly: false });
	const result = "ته کله کلي ته ځې؟".match(re);
	expect(result).toHaveLength(2)
});

test(`Should return many matches`, () => {
	const re = fuzzifyPashto("کار", { singleMatchOnly: false, beginningAt: "anywhere" });
	const result = "کار کوه، بېکاره مه ګرځه".match(re);
	expect(result).toHaveLength(2)
});

test(`matchWholeWordOnly should override begginingAt = "anywhere"`, () => {
	const re = fuzzifyPashto("کار", { matchWholeWordOnly: true, beginningAt: "anywhere" });
	const result = "کار کوه، بېکاره مه ګرځه".match(re);
	expect(result).toHaveLength(1)
});


test(`returnWholeWord should return the whole word`, () => {
	const re = fuzzifyPashto("کار", { returnWholeWord: true });
	const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
	expect(result).toHaveLength(1);
	expect(result).toContain("کارونه");
});

test(`returnWholeWord should return the whole word even when starting the matching in the middle`, () => {
	const re = fuzzifyPashto("کار", { returnWholeWord: true, beginningAt: "anywhere" });
	const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
	expect(result).toHaveLength(2);
	expect(result).toContain(" بېکاره");
});

test(`returnWholeWord should should not return parcel matches if matchWholeWordOnly is true`, () => {
	const re = fuzzifyPashto("کار", { returnWholeWord: true, beginningAt: "anywhere", matchWholeWordOnly: true });
	const result = "کارونه کوه، بېکاره مه ګرځه".match(re);
	expect(result).toBeNull();
});
