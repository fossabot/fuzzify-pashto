import { fuzzifyPashto } from '../src/fuzzify-pashto';

const matches = [
	["سرک", "صړق"],
	["انطذاړ", "انتظار"],
	["مالوم", "معلوم"],
	["معلوم", "مالوم"],
	["قېصا", "کيسه"],
	["کور", "قورونه"],
	["گرزيدل", "ګرځېدل"],
	["سنگہ", "څنګه"],
];

matches.forEach(m => {
	test(`${m[0]} should match ${m[1]}`, () => {
		const re = fuzzifyPashto(m[0]);
		const result = m[1].match(re);
		expect(result).toBeTruthy();
	});
})
