import {Type} from "./Type";
import Token from "./Token";
import {isNumber} from "./utils";
import AstNode, {BinOp, Num} from "./Ast";
import Lexer from "./Lexer";
import Parser from "./Parser";
import NodeVisitor from "./NodeVisitor";

//  解析parser 产生ast 得到表达式的结果
//
class Interpreter extends NodeVisitor{
    parser: Parser
    constructor(parser: Parser) {
        super();
        this.parser = parser;
    }

    interpret(): number {
        let root = this.parser.expr();
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


}

let lexer = new Lexer(" (5 + 3) * 12 / 3");
let parser = new Parser(lexer);
let interpreter = new Interpreter(parser);
console.log(interpreter.interpret());







