import Token from "./Token";

export enum Type {
    MINUS = "MINUS",
    PLUS = "PLUS",
    MUL = "MUL",
    DIV = "DIV",   // 整除
    DIVIDE = "DIVIDE", // 除
    INTEGER = "INTEGER", // 整型
    REAL = "REAL", // 浮点类型
    INTEGER_CONST = "INTEGER_CONST", // 整型常量
    REAL_CONST = "REAL_CONST", //浮点常量
    EOF = "EOF",
    LEFT_BRACKET = "LEFT_BRACKET",
    RIGHT_BRACKET = "RIGHT_BRACKET",
    BEGIN = "BEGIN",
    END = "END",
    ID = "ID",
    DOT = '.',
    ASSIGN = "ASSIGN",
    SEMI = 'SEMI', // 分号
    PROGRAM = "PROGRAM", // pascal关键字
    VAR = "VAR", // 关键字
    COLON = "COLON", // 冒号
    COMMA = "COMMA", // 逗号
    PROCEDURE = "PROCEDURE",
}

let RESERVED_KEYWORDS = {
    'PROGRAM': new Token(Type.PROGRAM, "PROGRAM"),
    'VAR': new Token(Type.VAR, "VAR"),
    'INTEGER': new Token(Type.INTEGER, "INTEGER"),
    'REAL': new Token(Type.REAL, "REAL"),
    'BEGIN': new Token(Type.BEGIN, "BEGIN"),
    'END': new Token(Type.END, "END"),
    'DIV': new Token(Type.DIV, "DIV"),
    'PROCEDURE': new Token(Type.PROCEDURE, "PROCEDURE"),
}
export {
    RESERVED_KEYWORDS
};