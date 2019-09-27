/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface IReplacerInfoItem {
    char: string;
    ignorable?: boolean;
}
interface IPashtoReplacerInfoItem extends IReplacerInfoItem {
    range?: string;
    repl?: string;
    plus?: string[];
}
interface IPhoneticsReplacerInfoItem extends IReplacerInfoItem {
    repl?: string;
}
export declare const pashtoReplacerInfo: IPashtoReplacerInfoItem[];
export declare const pashtoReplacerRegex: RegExp;
export declare const latinReplacerInfo: IPhoneticsReplacerInfoItem[];
export declare const latinReplacerRegex: RegExp;
export {};
