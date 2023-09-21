import AstNode, {BinOp, Num} from "./Ast";
import {Type} from "./Type";

export default abstract class NodeVisitor{
    visit(root: AstNode): number{
          if (root instanceof BinOp) {
              return this.visitBinOp(root);
          } else if (root instanceof Num) {
              return this.visitNum(root);
          }
    }
    abstract visitBinOp(root: AstNode): number;
    abstract visitNum(root: AstNode): number;

}
