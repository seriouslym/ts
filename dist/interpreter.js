"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Lexer_1 = require("./Lexer");
var Parser_1 = require("./Parser");
var NodeVisitor_1 = require("./NodeVisitor");
//  解析parser 产生ast 得到表达式的结果
//
var Interpreter = /** @class */ (function (_super) {
    __extends(Interpreter, _super);
    function Interpreter(parser) {
        var _this = _super.call(this) || this;
        _this.parser = parser;
        return _this;
    }
    Interpreter.prototype.interpret = function () {
        var root = this.parser.expr();
        return this.visit(root);
    };
    Interpreter.prototype.visitBinOp = function (root) {
        if (root.token.type === Constants_1.Type.MINUS) {
            return this.visit(root.left) - this.visit(root.right);
        }
        else if (root.token.type === Constants_1.Type.PLUS) {
            return this.visit(root.left) + this.visit(root.right);
        }
        else if (root.token.type === Constants_1.Type.DIV) {
            return this.visit(root.left) / this.visit(root.right);
        }
        else if (root.token.type === Constants_1.Type.MUL) {
            return this.visit(root.left) * this.visit(root.right);
        }
    };
    Interpreter.prototype.visitNum = function (root) {
        return parseInt(root.token.value);
    };
    Interpreter.prototype.visitUnaryOp = function (root) {
        if (root.token.type === Constants_1.Type.PLUS) {
            return this.visit(root.expr);
        }
        return -this.visit(root.expr);
    };
    return Interpreter;
}(NodeVisitor_1.default));
var program = "BEGIN\n" +
    "    BEGIN\n" +
    "        number := 2;\n" +
    "        a := number;\n" +
    "        b := 10 * a + 10 * number / 4;\n" +
    "        c := a - - b;\n" +
    "    END;\n" +
    "    x := 11;\n" +
    "END.";
var lexer = new Lexer_1.default(program);
var tokens = lexer.getTokens();
console.log(tokens.length, tokens);
var parser = new Parser_1.default(lexer);
// console.log(parser.parse());
// let interpreter = new Interpreter(parser);
// console.log(interpreter.interpret());
