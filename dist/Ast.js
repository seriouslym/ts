"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AstNode = /** @class */ (function () {
    function AstNode(token, left, right) {
        if (left === void 0) { left = null; }
        if (right === void 0) { right = null; }
        this.token = token;
        this.left = left;
        this.right = right;
    }
    return AstNode;
}());
exports.default = AstNode;
