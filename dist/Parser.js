"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var AstNode_1 = require("./AstNode");
// 根据tokenizer得到的token 进行parse得到ast
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }
    Parser.prototype.error = function () {
        throw new Error('parse error');
    };
    Parser.prototype.eat = function (type) {
        if (this.currentToken.type === type) {
            this.currentToken = this.lexer.getNextToken();
        }
        else {
            this.error();
        }
    };
    Parser.prototype.factor = function () {
        var token = this.currentToken;
        try {
            if (token.type === Constants_1.Type.INTEGER) {
                this.eat(Constants_1.Type.INTEGER);
                return new AstNode_1.Num(token);
            }
            else if (token.type === Constants_1.Type.LEFT_BRACKET) {
                this.eat(Constants_1.Type.LEFT_BRACKET);
                var node = this.expr();
                this.eat(Constants_1.Type.RIGHT_BRACKET);
                return node;
            }
            else if (token.type === Constants_1.Type.PLUS) {
                this.eat(Constants_1.Type.PLUS);
                return new AstNode_1.UnaryOp(token, this.factor());
            }
            else if (token.type === Constants_1.Type.MINUS) {
                this.eat(Constants_1.Type.MINUS);
                return new AstNode_1.UnaryOp(token, this.factor());
            }
            else {
                return this.variable();
            }
        }
        catch (e) {
            console.log(e);
        }
    };
    Parser.prototype.term = function () {
        var node = this.factor();
        while ([Constants_1.Type.MUL, Constants_1.Type.DIV].indexOf(this.currentToken.type) !== -1) {
            var token = this.currentToken;
            if (this.currentToken.type === Constants_1.Type.MUL) {
                this.eat(Constants_1.Type.MUL);
            }
            else {
                this.eat(Constants_1.Type.DIV);
            }
            node = new AstNode_1.BinOp(token, node, this.factor());
        }
        return node;
    };
    Parser.prototype.expr = function () {
        var node = this.term();
        while ([Constants_1.Type.PLUS, Constants_1.Type.MINUS].indexOf(this.currentToken.type) !== -1) {
            var token = this.currentToken;
            if (this.currentToken.type === Constants_1.Type.PLUS) {
                this.eat(Constants_1.Type.PLUS);
            }
            else {
                this.eat(Constants_1.Type.MINUS);
            }
            node = new AstNode_1.BinOp(token, node, this.term());
        }
        return node;
    };
    /**
     * compound dot
     */
    Parser.prototype.program = function () {
        var node = this.compoundStatement();
        this.eat(Constants_1.Type.DOT);
        return node;
    };
    /**
     * BEGIN
     *     statements
     * END.
     */
    Parser.prototype.compoundStatement = function () {
        try {
            this.eat(Constants_1.Type.BEGIN);
            var node = this.statementList();
            this.eat(Constants_1.Type.END);
            var root = new AstNode_1.Compound();
            for (var i = 0; i < node.length; i++) {
                root.children.push(node[i]);
            }
            return root;
        }
        catch (e) {
            console.log(e);
        }
    };
    /**
     * statement | statement; statements
     */
    Parser.prototype.statementList = function () {
        var node;
        node = [this.statement()];
        while (this.currentToken.type === Constants_1.Type.SEMI) {
            this.eat(Constants_1.Type.SEMI);
            node = __spreadArray(__spreadArray([], node, true), [this.statement()], false);
        }
        if (this.currentToken.type === Constants_1.Type.ID) {
            this.error();
        }
        return node;
    };
    /**
     * BEGIN
     *     BEGIN
     *         number := 2;
     *         a := number;
     *         b := 10 * a + 10 * number / 4;
     *         c := a - - b
     *     END; statement
     *     x := 11; statement
     * END.
     */
    Parser.prototype.statement = function () {
        var node;
        if (this.currentToken.type === Constants_1.Type.BEGIN) {
            node = this.compoundStatement();
        }
        else if (this.currentToken.type === Constants_1.Type.ID) {
            node = this.assignStatement();
        }
        else {
            node = this.empty();
        }
        return node;
    };
    Parser.prototype.assignStatement = function () {
        try {
            var left = this.variable();
            var token = this.currentToken;
            this.eat(Constants_1.Type.ASSIGN);
            var right = this.expr();
            return new AstNode_1.Assign(token, left, right);
        }
        catch (e) {
            console.log(e);
        }
    };
    Parser.prototype.variable = function () {
        try {
            var node = new AstNode_1.Var(this.currentToken);
            this.eat(Constants_1.Type.ID);
            return node;
        }
        catch (e) {
            console.log(e);
        }
    };
    Parser.prototype.empty = function () {
        return new AstNode_1.NoOp();
    };
    Parser.prototype.parse = function () {
        var node = this.program();
        if (this.currentToken.type !== Constants_1.Type.EOF) {
            this.error();
        }
        return node;
    };
    return Parser;
}());
exports.default = Parser;
