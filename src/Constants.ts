import Token from "./Token";

export enum Type {
    MINUS = "MINUS",
    PLUS = "PLUS",
    MUL = "MUL",
    DIV = "DIV",
    INTEGER = "INTEGER",
    EOF = "EOF",
    LEFT_BRACKET = "LEFT_BRACKET",
    RIGHT_BRACKET = "RIGHT_BRACKET",
    BEGIN = "BEGIN",
    END = "END",
    ID = "ID",
    DOT = '.',
    ASSIGN = "ASSIGN",
    SEMI = 'SEMI',
}

let RESERVED_KEYWORDS = {
    'BEGIN': new Token(Type.BEGIN, "BEGIN"),
    'END': new Token(Type.END, "END")
}
export {
    RESERVED_KEYWORDS
};