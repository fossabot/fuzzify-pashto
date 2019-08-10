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

const matchesWithSpaces = [
	['دپاره', 'د پاره'],
	['بېکار', 'بې کار'],
	['د پاره', 'د پاره'],
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
