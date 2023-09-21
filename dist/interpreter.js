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
var Type_1 = require("./Type");
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
        if (root.token.type === Type_1.Type.MINUS) {
            return this.visit(root.left) - this.visit(root.right);
        }
        else if (root.token.type === Type_1.Type.PLUS) {
            return this.visit(root.left) + this.visit(root.right);
        }
        else if (root.token.type === Type_1.Type.DIV) {
            return this.visit(root.left) / this.visit(root.right);
        }
        else if (root.token.type === Type_1.Type.MUL) {
            return this.visit(root.left) * this.visit(root.right);
        }
    };
    Interpreter.prototype.visitNum = function (root) {
        return parseInt(root.token.value);
    };
    return Interpreter;
}(NodeVisitor_1.default));
var lexer = new Lexer_1.default(" (5 + 3) * 12 / 3");
var parser = new Parser_1.default(lexer);
var interpreter = new Interpreter(parser);
console.log(interpreter.interpret());
