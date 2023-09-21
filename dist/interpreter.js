"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type_1 = require("./Type");
var Token_1 = require("./Token");
var utils_1 = require("./utils");
var Ast_1 = require("./Ast");
var Interpreter = /** @class */ (function () {
    function Interpreter(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text.charAt(this.pos);
        this.currentToken = this.getNextToken();
    }
    Interpreter.prototype.advance = function () {
        this.pos++;
        if (this.pos >= this.text.length) {
            this.currentChar = null;
        }
        else {
            this.currentChar = this.text.charAt(this.pos);
        }
    };
    Interpreter.prototype.skipWhitespace = function () {
        while (this.pos !== null && this.currentChar === ' ') {
            this.advance();
        }
    };
    Interpreter.prototype.getNextToken = function () {
        while (this.currentChar != null) {
            if (this.currentChar === ' ') {
                this.skipWhitespace();
                continue;
            }
            else if ((0, utils_1.isNumber)(this.currentChar)) {
                var start = this.pos;
                while (this.currentChar !== null && (0, utils_1.isNumber)(this.currentChar)) {
                    this.advance();
                }
                return new Token_1.default(Type_1.Type.INTEGER, this.text.slice(start, this.pos));
            }
            else if (this.currentChar === '+') {
                this.advance();
                return new Token_1.default(Type_1.Type.PLUS, "+");
            }
            else if (this.currentChar === '-') {
                this.advance();
                return new Token_1.default(Type_1.Type.MINUS, "-");
            }
            else if (this.currentChar === '*') {
                this.advance();
                return new Token_1.default(Type_1.Type.MUL, "*");
            }
            else if (this.currentChar === '/') {
                this.advance();
                return new Token_1.default(Type_1.Type.DIV, "/");
            }
            else if (this.currentChar === '(') {
                this.advance();
                return new Token_1.default(Type_1.Type.LEFT_BRACKET, '(');
            }
            else if (this.currentChar === ')') {
                this.advance();
                return new Token_1.default(Type_1.Type.RIGHT_BRACKET, ')');
            }
            throw new Error("Invalid Character ".concat(this.pos, " ").concat(this.currentChar));
        }
        return new Token_1.default(Type_1.Type.EOF, null);
    };
    // getTokens(): Token[] {
    //     let res: Token[] = [];
    //     while (this.currentChar !== null) {
    //         res.push(this.getNextToken());
    //     }
    //     return res;
    // }
    Interpreter.prototype.eat = function (type) {
        if (this.currentToken.type === type) {
            this.currentToken = this.getNextToken();
        }
        else {
            throw new Error("parse error");
        }
    };
    Interpreter.prototype.factor = function () {
        var token = this.currentToken;
        try {
            if (token.type === Type_1.Type.INTEGER) {
                this.eat(Type_1.Type.INTEGER);
                return new Ast_1.default(token);
            }
            else if (token.type === Type_1.Type.LEFT_BRACKET) {
                this.eat(Type_1.Type.LEFT_BRACKET);
                var node = this.expr();
                this.eat(Type_1.Type.RIGHT_BRACKET);
                return node;
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    Interpreter.prototype.term = function () {
        var node = this.factor();
        while ([Type_1.Type.MUL, Type_1.Type.DIV].indexOf(this.currentToken.type) !== -1) {
            var token = this.currentToken;
            if (this.currentToken.type === Type_1.Type.MUL) {
                this.eat(Type_1.Type.MUL);
            }
            else {
                this.eat(Type_1.Type.DIV);
            }
            node = new Ast_1.default(token, node, this.factor());
        }
        return node;
    };
    Interpreter.prototype.expr = function () {
        var node = this.term();
        while ([Type_1.Type.PLUS, Type_1.Type.MINUS].indexOf(this.currentToken.type) !== -1) {
            var token = this.currentToken;
            if (this.currentToken.type === Type_1.Type.PLUS) {
                this.eat(Type_1.Type.PLUS);
            }
            else {
                this.eat(Type_1.Type.MINUS);
            }
            node = new Ast_1.default(token, node, this.term());
        }
        return node;
    };
    return Interpreter;
}());
var interpreter = new Interpreter("1 - 2 * 2    ");
console.log(interpreter.expr());
