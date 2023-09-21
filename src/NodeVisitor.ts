import AstNode, {Assign, BinOp, Compound, NoOp, Num, UnaryOp, Var} from "./AstNode";
import {Type} from "./Constants";

export default abstract class NodeVisitor{
    visit(root: AstNode): any{
        if (root instanceof BinOp) {
            return this.visitBinOp(root);
        } else if (root instanceof Num) {
            return this.visitNum(root);
        } else if (root instanceof UnaryOp) {
            return this.visitUnaryOp(root);
        } else if (root instanceof Compound) {
            return this.visitCompound(root);
        } else if (root instanceof NoOp) {
            return this.visitNoOp(root);
        } else if (root instanceof Assign) {
            return this.visitAssign(root);
        } else if (root instanceof Var) {
            return this.visitVar(root);
        }
    }
    abstract visitBinOp(root: AstNode): number;
    abstract visitNum(root: AstNode): number;
    abstract visitUnaryOp(root: AstNode): number;
    abstract visitCompound(root: AstNode): void;
    abstract visitNoOp(root: AstNode): void;
    abstract visitAssign(root: AstNode): void;
    abstract visitVar(root: AstNode): number;
}
