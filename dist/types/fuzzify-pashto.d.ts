/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
interface FuzzifyOptions {
    beginningAt?: string;
    matchWholeWordOnly?: boolean;
    allowSpacesInWords?: boolean;
    singleMatchOnly?: boolean;
    returnWholeWord?: boolean;
}
export declare function fuzzifyPashto(input: string, options?: FuzzifyOptions): RegExp;
export {};
