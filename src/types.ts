export interface IFuzzifyOptions {
    matchStart?: "word" | "string" | "anywhere";
    matchWholeWordOnly?: boolean;
    allowSpacesInWords?: boolean;
    returnWholeWord?: boolean;
    es2018?: boolean;
    ignoreDiacritics?: boolean;
}