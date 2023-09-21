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
exports.Num = exports.BinOp = void 0;
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
