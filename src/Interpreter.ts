import {Type} from "./Constants";
import AstNode, {Assign, BinOp, Block, Compound, NoOp, Num, Program, UnaryOp, Var} from "./AstNode";
import Parser from "./Parser";
import NodeVisitor from "./NodeVisitor";

//  解析parser 产生ast 得到表达式的结果
// 定义一个value为number类型对象
type variablePool = {
    [key: string]: number;
}
export class Interpreter extends NodeVisitor{
    parser: Parser
    GLOBAL_SCOPE: variablePool;
    constructor(parser: Parser) {
        super();
        this.parser = parser;
        this.GLOBAL_SCOPE = {};
    }

    interpret(): void {
        let root = this.parser.program();
        this.visit(root);
    }

    visitBinOp(root: BinOp): number {
        if (root.token.type === Type.MINUS) {
            return this.visit(root.left) - this.visit(root.right);
        } else if (root.token.type === Type.PLUS) {
            return this.visit(root.left) + this.visit(root.right);
        } else if (root.token.type === Type.DIV) {
            return Math.floor(this.visit(root.left) / this.visit(root.right));
        } else if (root.token.type === Type.MUL) {
            return this.visit(root.left) * this.visit(root.right);
        } else if (root.token.type === Type.DIVIDE) {
            return this.visit(root.left) / this.visit(root.right);
        }
    }

    visitNum(root: Num): number {
        return Number(root.token.value);
    }

    visitUnaryOp(root: UnaryOp): number {
        if (root.token.type === Type.PLUS){
            return this.visit(root.expr);
        }
        return -this.visit(root.expr);
    }

    visitCompound(root: Compound): any {
        for (let i = 0; i < root.children.length; i++) {
            this.visit(root.children[i]);
        }
    }

    visitNoOp(root: NoOp): void {
    }

    visitAssign(root: Assign): void {
        let varName = root.leftOp.token.value;
        this.GLOBAL_SCOPE[varName] = this.visit(root.rightOp);
    }

    visitVar(root: Var): number {
        let varName = root.token.value;
        let value = this.GLOBAL_SCOPE[varName];
        if (value == undefined) {
            throw new Error(`${varName} not defined`);
        }
        return value;
    }

    visitBlock(root: Block): void {
        for (let declaration of root.declarations) {
            this.visit(declaration);
        }
        this.visit(root.compound);
    }

    visitProgram(root: Program): void {
        this.visit(root.block);
    }

    visitType(root: AstNode): void {
    }

    visitVarDecl(root: AstNode): void {
    }


}








