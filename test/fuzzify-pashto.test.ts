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
	],
	nonMatches: [
		["سرک", "ترک"],
		["کار", "بېکاري"],
	],
};

const optionsPossibilities = [
	{
		options: {}, // default
		...defaultInfo,
	},
	{
		options: {beginningAt: "begginningOfWord"}, // same as default
		...defaultInfo,
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
		options: {matchWholeWord: true},
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
		options: {beginningAt: "beginningOfString"},
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
