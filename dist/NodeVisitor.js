"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AstNode_1 = require("./AstNode");
var NodeVisitor = /** @class */ (function () {
    function NodeVisitor() {
    }
    NodeVisitor.prototype.visit = function (root) {
        if (root instanceof AstNode_1.BinOp) {
            return this.visitBinOp(root);
        }
        else if (root instanceof AstNode_1.Num) {
            return this.visitNum(root);
        }
        else if (root instanceof AstNode_1.UnaryOp) {
            return this.visitUnaryOp(root);
        }
    };
    return NodeVisitor;
}());
exports.default = NodeVisitor;
