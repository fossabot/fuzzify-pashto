interface FuzzifyOptions {
    beginningAt?: string;
    matchWholeWord?: boolean;
    allowSpacesInWords?: boolean;
    singleMatchOnly?: boolean;
}
export declare function fuzzifyPashto(input: string, options: FuzzifyOptions): RegExp;
export {};
