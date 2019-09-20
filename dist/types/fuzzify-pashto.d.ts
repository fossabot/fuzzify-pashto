/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface IFuzzifyOptions {
    globalMatch?: boolean;
    matchStart?: (string | "word" | "string" | "anywhere");
    matchWholeWordOnly?: boolean;
    allowSpacesInWords?: boolean;
    returnWholeWord?: boolean;
    es2018?: boolean;
    ignoreDiacritics?: boolean;
}
export declare function fuzzifyPashto(input: string, options?: IFuzzifyOptions): RegExp;
export declare function es2018IsSupported(): boolean;
export {};
