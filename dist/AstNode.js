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
exports.NoOp = exports.Var = exports.Assign = exports.Compound = exports.UnaryOp = exports.Num = exports.BinOp = void 0;
var AstNode = /** @class */ (function () {
    function AstNode(token) {
        this.token = token;
    }
    return AstNode;
}());
exports.default = AstNode;
var BinOp = /** @class */ (function (_super) {
    __extends(BinOp, _super);
    function BinOp(token, left, right) {
        var _this = _super.call(this, token) || this;
        _this.left = left;
        _this.right = right;
        return _this;
    }
    return BinOp;
}(AstNode));
exports.BinOp = BinOp;
var Num = /** @class */ (function (_super) {
    __extends(Num, _super);
    function Num(token) {
        return _super.call(this, token) || this;
    }
    return Num;
}(AstNode));
exports.Num = Num;
// 一元运算符 + - 包含自身token 还有其后跟的运算表达式expr
var UnaryOp = /** @class */ (function (_super) {
    __extends(UnaryOp, _super);
    function UnaryOp(token, expr) {
        var _this = _super.call(this, token) || this;
        _this.expr = expr;
        return _this;
    }
    return UnaryOp;
}(AstNode));
exports.UnaryOp = UnaryOp;
/*
    pascal的复合语句由Begin statements end组成
    其中statements由多条statement表示 最后一条statement后可以不加分号
    statement包含赋值 | 空 | 复合语句（Begin嵌套）
 */
var Compound = /** @class */ (function (_super) {
    __extends(Compound, _super);
    function Compound() {
        var _this = _super.call(this, null) || this;
        _this.children = [];
        return _this;
    }
    return Compound;
}(AstNode));
exports.Compound = Compound;
var Assign = /** @class */ (function (_super) {
    __extends(Assign, _super);
    function Assign(token, leftOp, rightOp) {
        var _this = _super.call(this, token) || this;
        _this.leftOp = leftOp;
        _this.rightOp = rightOp;
        return _this;
    }
    return Assign;
}(AstNode));
exports.Assign = Assign;
var Var = /** @class */ (function (_super) {
    __extends(Var, _super);
    function Var(token) {
        return _super.call(this, token) || this;
    }
    return Var;
}(AstNode));
exports.Var = Var;
var NoOp = /** @class */ (function (_super) {
    __extends(NoOp, _super);
    function NoOp() {
        return _super.call(this, null) || this;
    }
    return NoOp;
}(AstNode));
exports.NoOp = NoOp;
