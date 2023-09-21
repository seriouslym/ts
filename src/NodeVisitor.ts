import AstNode, {BinOp, Num, UnaryOp} from "./AstNode";
import {Type} from "./Constants";

export default abstract class NodeVisitor{
    visit(root: AstNode): number{
        if (root instanceof BinOp) {
            return this.visitBinOp(root);
        } else if (root instanceof Num) {
            return this.visitNum(root);
        } else if (root instanceof UnaryOp) {
            return this.visitUnaryOp(root);
        }
    }
    abstract visitBinOp(root: AstNode): number;
    abstract visitNum(root: AstNode): number;
    abstract visitUnaryOp(root: AstNode): number;
}
