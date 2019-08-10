interface FuzzifyOptions {
    beginningAt?: string;
    matchWholeWord?: boolean;
}
export declare function fuzzifyPashto(input: string, options?: FuzzifyOptions): RegExp;
export {};
