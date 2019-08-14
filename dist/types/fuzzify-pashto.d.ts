interface FuzzifyOptions {
    beginningAt?: string;
    matchWholeWordOnly?: boolean;
    allowSpacesInWords?: boolean;
    singleMatchOnly?: boolean;
    returnWholeWord?: boolean;
}
export declare function fuzzifyPashto(input: string, options?: FuzzifyOptions): RegExp;
export {};
