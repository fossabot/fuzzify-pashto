/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface IReplacerInfoItem {
    char: string;
    range: string;
    plus?: string[];
    ignorable?: boolean;
}
declare const pashtoReplacerInfo: IReplacerInfoItem[];
declare const pashtoReplacerRegex: RegExp;
export { pashtoReplacerInfo, pashtoReplacerRegex };
