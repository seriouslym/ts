"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESERVED_KEYWORDS = exports.Type = void 0;
var Token_1 = require("./Token");
var Type;
(function (Type) {
    Type["MINUS"] = "MINUS";
    Type["PLUS"] = "PLUS";
    Type["MUL"] = "MUL";
    Type["DIV"] = "DIV";
    Type["INTEGER"] = "INTEGER";
    Type["EOF"] = "EOF";
    Type["LEFT_BRACKET"] = "LEFT_BRACKET";
    Type["RIGHT_BRACKET"] = "RIGHT_BRACKET";
    Type["BEGIN"] = "BEGIN";
    Type["END"] = "END";
    Type["ID"] = "ID";
    Type["DOT"] = ".";
    Type["ASSIGN"] = "ASSIGN";
    Type["SEMI"] = "SEMI";
})(Type || (exports.Type = Type = {}));
var RESERVED_KEYWORDS = {
    'BEGIN': new Token_1.default(Type.BEGIN, "BEGIN"),
    'END': new Token_1.default(Type.END, "END")
};
exports.RESERVED_KEYWORDS = RESERVED_KEYWORDS;
