import AstNode, {Assign, BinOp, Compound, Num, Program, UnaryOp, Var} from "../AstNode";
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
let program  = "PROGRAM Part10AST;\n" +
    "VAR\n" +
    "   a, b : INTEGER;\n" +
    "   y    : REAL;\n" +
    "BEGIN {Part10AST}\n" +
    "   a := 2;\n" +
    "   b := 10 * a + 10 * a DIV 4;\n" +
    "   y := 20 / 7 + 3.14;\n" +
    "END.  {Part10AST}"
let lexer = new Lexer(program);
console.log(lexer.getTokens());
let tokens = lexer.getTokens();
let parser = new Parser(lexer);

// console.log(parser.parse());
let interpreter = new Interpreter(parser);
let node = interpreter.interpret() as Program;
node.block.declarations.forEach((v, i) => {
    console.log(v)
})

console.log(interpreter.GLOBAL_SCOPE)
// console.log(interpreter.GLOBAL_SCOPE);


