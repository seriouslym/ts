import {Type} from "./Constants";
import {BinOp, Num, UnaryOp} from "./AstNode";
import Lexer from "./Lexer";
import Parser from "./Parser";
import NodeVisitor from "./NodeVisitor";
import {isAlpha} from "./utils";

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

    visitUnaryOp(root: UnaryOp): number {
        if (root.token.type === Type.PLUS){
            return this.visit(root.expr);
        }
        return -this.visit(root.expr);
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
// let interpreter = new Interpreter(parser);
// console.log(interpreter.interpret());








