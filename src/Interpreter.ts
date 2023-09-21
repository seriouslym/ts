import {Type} from "./Constants";
import AstNode, {Assign, BinOp, Compound, NoOp, Num, UnaryOp, Var} from "./AstNode";
import Lexer from "./Lexer";
import Parser from "./Parser";
import NodeVisitor from "./NodeVisitor";
import {isAlpha} from "./utils";

//  解析parser 产生ast 得到表达式的结果
// 定义一个value为number类型对象
type variablePool = {
    [key: string]: number;
}
class Interpreter extends NodeVisitor{
    parser: Parser
    GLOBAL_SCOPE: variablePool;
    constructor(parser: Parser) {
        super();
        this.parser = parser;
        this.GLOBAL_SCOPE = {};
    }

    interpret(): number {
        let root = this.parser.program();
        return this.visit(root);
    }

    visitBinOp(root: BinOp): number {
        if (root.token.type === Type.MINUS) {
            return this.visit(root.left) - this.visit(root.right);
        } else if (root.token.type === Type.PLUS) {
            return this.visit(root.left) + this.visit(root.right);
        } else if (root.token.type === Type.DIV) {
            return this.visit(root.left) / this.visit(root.right);
        } else if (root.token.type === Type.MUL) {
            return this.visit(root.left) * this.visit(root.right);
        }
    }

    visitNum(root: Num): number {
        return parseInt(root.token.value);
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


}

let program  = "BEGIN\n" +
    "    BEGIN\n" +
    "        number := 2;\n" +
    "        a := number;\n" +
    "        b := 10 * a + 10 * number / 4;\n" +
    "        c := a - - b;\n" +
    "    END;\n" +
    "    x := 11;\n" +
    "END."
let lexer = new Lexer(program);
let tokens = lexer.getTokens();
console.log(tokens.length, tokens);
let parser = new Parser(lexer);

// console.log(parser.parse());
let interpreter = new Interpreter(parser);
interpreter.interpret();
console.log(interpreter.GLOBAL_SCOPE);








