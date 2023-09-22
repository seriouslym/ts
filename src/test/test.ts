import AstNode, {Assign, BinOp, Compound, Num, UnaryOp, Var} from "../AstNode";
import Lexer from "../Lexer";
import Parser from "../Parser";
import {Interpreter} from "../Interpreter";
import {isAlpha} from "../utils";

function layer(root: AstNode): void{
    let queue: AstNode[] = [root];
    let idx = 0;
    while (queue.length) {
        let tmp = queue;
        queue = [];
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] instanceof Compound) {
                let compound = tmp[i] as Compound;
                for (let j = 0; j < compound.children.length; j++) {
                    queue.push(compound.children[j]);
                }
            } else if (tmp[i] instanceof BinOp) {
                let binOP = tmp[i] as BinOp;
                queue.push(binOP.left);
                queue.push(binOP.right);
            } else if (tmp[i] instanceof UnaryOp) {
                let unaryOp = tmp[i] as UnaryOp;
                queue.push(unaryOp.expr);
            } else if (tmp[i] instanceof Assign) {
                let assign = tmp[i] as Assign;
                queue.push(assign.leftOp);
                queue.push(assign.rightOp);
            }

        }
        console.log(idx, tmp);
        idx++;
    }
}
let program  = "begin\n" +
    "    BEGIN\n" +
    "        number := 2;\n" +
    "        a := number;\n" +
    "        b := 10 * a + 10 * number div 4;\n" +
    "        c := a / 3;\n" +
    "    END;\n" +
    "    x := 11;\n" +
    "end."
let lexer = new Lexer(program);
console.log(lexer.getTokens());
let tokens = lexer.getTokens();
let parser = new Parser(lexer);

// console.log(parser.parse());
let interpreter = new Interpreter(parser);
let node = interpreter.interpret();
console.log(node)

console.log(interpreter.GLOBAL_SCOPE);


