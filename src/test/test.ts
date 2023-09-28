import AstNode, {Assign, BinOp, Compound, Num, Program, UnaryOp, Var} from "../ast/AstNode";
import Lexer from "../Lexer";
import Parser from "../Parser";
import {Interpreter} from "../Interpreter";
import {isAlpha, isEscapeChar} from "../Utils";
import {GenerateDot} from "../ast/GenerateDot";
import * as fs from "fs";
import * as path from "path";
import {BuiltinTypeSymbol, VarSymbol} from "../symbol/MySymbol";
import {SymbolTableBuilder} from "../symbol/SymbolTableBuilder";
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
// node 需要用绝对路径
let sourceCodePath = path.join(...[__dirname, "../../public/hello.pas"]);
let program: string = fs.readFileSync(sourceCodePath).toString();
let lexer = new Lexer(program);
let parser = new Parser(lexer);
// let interpreter = new Interpreter(parser);
console.log(parser.program());
// let symbolTableBuilder = new SymbolTableBuilder();
// symbolTableBuilder.visit(parser.program());
// console.log(symbolTableBuilder.symbolTable.toString());

// interpreter.visit(root);
// console.log(interpreter.GLOBAL_SCOPE);
// let generateDot = new GenerateDot(parser);
// let targetPath = path.join(...[__dirname, '../../public/ast.dot']);
// fs.writeFileSync(targetPath, generateDot.dot());
// console.log(generateDot.dot());
// console.log(parser.parse());
// let interpreter = new Interpreter(parser);
// interpreter.interpret();
// node.block.declarations.forEach((v, i) => {
//     console.log(v)
// })
//
// console.log(interpreter.GLOBAL_SCOPE)
// console.log(interpreter.GLOBAL_SCOPE);


