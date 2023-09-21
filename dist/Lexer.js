"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Token_1 = require("./Token");
var utils_1 = require("./utils");
var Constants_1 = require("./Constants");
// 也可以称为 Tokenizer
var Lexer = /** @class */ (function () {
    function Lexer(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text.charAt(this.pos);
    }
    Lexer.prototype.advance = function () {
        this.pos++;
        if (this.pos >= this.text.length) {
            this.currentChar = null;
        }
        else {
            this.currentChar = this.text.charAt(this.pos);
        }
    };
    Lexer.prototype.skipWhitespace = function () {
        while (this.pos !== null && (this.currentChar === ' ' || this.currentChar === '\n')) {
            this.advance();
        }
    };
    Lexer.prototype.integer = function () {
        var start = this.pos;
        while (this.currentChar !== null && (0, utils_1.isNumber)(this.currentChar)) {
            this.advance();
        }
        return this.text.slice(start, this.pos);
    };
    Lexer.prototype.id = function () {
        var start = this.pos;
        while (this.currentChar !== null && (0, utils_1.isAlpha)(this.currentChar)) {
            this.advance();
        }
        return this.text.slice(start, this.pos);
    };
    // 查看下一个pos位置的字符，但pos并不增加
    Lexer.prototype.peek = function () {
        if (this.pos + 1 < this.text.length) {
            return this.text.charAt(this.pos + 1);
        }
        return null;
    };
    Lexer.prototype.getNextToken = function () {
        var _a;
        while (this.currentChar != null) {
            if (this.currentChar === ' ' || this.currentChar === '\n') {
                this.skipWhitespace();
                continue;
            }
            else if ((0, utils_1.isAlpha)(this.currentChar)) {
                var id = this.id();
                return (_a = Constants_1.RESERVED_KEYWORDS[id]) !== null && _a !== void 0 ? _a : new Token_1.default(Constants_1.Type.ID, id);
            }
            else if ((0, utils_1.isNumber)(this.currentChar)) {
                return new Token_1.default(Constants_1.Type.INTEGER, this.integer());
            }
            else if (this.currentChar === ':' && this.peek() === '=') {
                this.advance();
                this.advance();
                return new Token_1.default(Constants_1.Type.ASSIGN, ':=');
            }
            else if (this.currentChar === ';') {
                this.advance();
                return new Token_1.default(Constants_1.Type.SEMI, ";");
            }
            else if (this.currentChar === '.') {
                this.advance();
                return new Token_1.default(Constants_1.Type.DOT, ".");
            }
            else if (this.currentChar === '+') {
                this.advance();
                return new Token_1.default(Constants_1.Type.PLUS, "+");
            }
            else if (this.currentChar === '-') {
                this.advance();
                return new Token_1.default(Constants_1.Type.MINUS, "-");
            }
            else if (this.currentChar === '*') {
                this.advance();
                return new Token_1.default(Constants_1.Type.MUL, "*");
            }
            else if (this.currentChar === '/') {
                this.advance();
                return new Token_1.default(Constants_1.Type.DIV, "/");
            }
            else if (this.currentChar === '(') {
                this.advance();
                return new Token_1.default(Constants_1.Type.LEFT_BRACKET, '(');
            }
            else if (this.currentChar === ')') {
                this.advance();
                return new Token_1.default(Constants_1.Type.RIGHT_BRACKET, ')');
            }
            throw new Error("Invalid Character ".concat(this.pos, " ").concat(this.currentChar));
        }
        return new Token_1.default(Constants_1.Type.EOF, null);
    };
    // 测试
    Lexer.prototype.getTokens = function () {
        var res = [];
        while (this.currentChar !== null) {
            res.push(this.getNextToken());
        }
        this.pos = 0;
        this.currentChar = this.text.charAt(this.pos);
        return res;
    };
    return Lexer;
}());
exports.default = Lexer;
