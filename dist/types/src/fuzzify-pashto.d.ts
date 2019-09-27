/**
 * Copyright (c) openpashto.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { IFuzzifyOptions } from "./types";
export declare const pashtoCharacterRange = "\u0621-\u065F\u0670-\u06D3\u06D5";
export declare const pashtoWordBoundaryBeginning: string;
export declare const pashtoWordBoundaryBeginningWithES2018: string;
export declare function fuzzifyPashto(input: string, options?: IFuzzifyOptions): string;
