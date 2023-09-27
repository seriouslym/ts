// 遍历Ast 通过符号表进行类型判断和定义检查
import NodeVisitor from "../NodeVisitor";
import AstNode, {Assign, BinOp, Block, Compound, NoOp, Program, UnaryOp, Var, VarDecl} from "../ast/AstNode";
import {SymbolTable} from "./SymbolTable";
import {VarSymbol} from "./MySymbol";

export class SymbolTableBuilder extends NodeVisitor{
    symbolTable: SymbolTable;
    constructor() {
        super();
        this.symbolTable = new SymbolTable();
    }
    visitAssign(root: Assign): void {
        let name = root.leftOp.token.value;
        if (!this.symbolTable.lookup(name)) {
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
        if (!this.symbolTable.lookup(name)) {
            throw new Error(`param ${name} not defined`);
        }
        return 0;
    }

    visitVarDecl(root: VarDecl): void {
        let typeName = root.typeNode.token.value;
        let typeSymbol = this.symbolTable.lookup(typeName);
        this.symbolTable.put(new VarSymbol(root.varNode.token.value, typeSymbol));
    }

    visitProcedureDecl(root: AstNode): void {
    }





}