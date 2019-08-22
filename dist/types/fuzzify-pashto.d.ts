/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
interface FuzzifyOptions {
    globalMatch?: boolean;
    matchStart?: string;
    matchWholeWordOnly?: boolean;
    allowSpacesInWords?: boolean;
    returnWholeWord?: boolean;
}
export declare function fuzzifyPashto(input: string, options?: FuzzifyOptions): RegExp;
export {};