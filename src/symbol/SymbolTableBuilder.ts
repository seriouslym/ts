// 遍历Ast 通过符号表进行类型判断和定义检查
import NodeVisitor from "../core/NodeVisitor";
import AstNode, {Assign, BinOp, Block, Compound, NoOp, Program, UnaryOp, Var, VarDecl} from "../AstNode";
import {SymbolTable} from "./SymbolTable";
import {VarSymbol} from "./MySymbol";

// 类型检查 未定义引用等检查 就是语义检查(合乎语法，但是在parser过程中并不能发现语义错误)
export class SymbolTableBuilder extends NodeVisitor{
    symbolTable: SymbolTable;
    constructor() {
        super();
        this.symbolTable = new SymbolTable();
    }
    visitAssign(root: Assign): void {
        let name = root.leftOp.token.value;
        if (!this.symbolTable.get(name)) {
            throw new Error(`param ${name} not defined`);
        }
        this.visit(root.rightOp);
    }

    visitBinOp(root: BinOp): number {
        this.visit(root.left);
        this.visit(root.right);
        return 0;
    }

    visitBlock(root: Block): void {
        for (let declaration of root.declarations) {
            this.visit(declaration);
        }
        this.visit(root.compound);
    }

    visitCompound(root: Compound): void {
        for (let child of root.children) {
            this.visit(child);
        }
    }

    visitNoOp(root: NoOp): void {
    }

    visitNum(root: AstNode): number {
        return 0;
    }

    visitProgram(root: Program): void {
        this.visit(root.block);
    }

    visitType(root: AstNode): void {
    }

    visitUnaryOp(root: UnaryOp): number {
        this.visit(root.expr);
        return 0;
    }

    visitVar(root: Var): number {
        let name = root.token.value;
        if (!this.symbolTable.get(name)) {
            throw new Error(`param ${name} not defined`);
        }
        return 0;
    }

    visitVarDecl(root: VarDecl): void {
        let typeName = root.typeNode.token.value;
        let typeSymbol = this.symbolTable.get(typeName);
        this.symbolTable.put(new VarSymbol(root.varNode.token.value, typeSymbol));
    }

    visitProcedureDecl(root: AstNode): void {
    }

    visitParams(root: AstNode): void {
    }





}