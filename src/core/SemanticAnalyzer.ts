import NodeVisitor from "./NodeVisitor";
import AstNode, {Assign, BinOp, Block, Compound, Param, ProcedureDecl, Program, Var, VarDecl} from "../AstNode";
import {ScopedSymbolTable} from "../symbol/ScopedSymbolTable";
import {BuiltinTypeSymbol, ProcedureSymbol, VarSymbol} from "../symbol/MySymbol";

export class SemanticAnalyzer extends NodeVisitor {
    currentScope: ScopedSymbolTable;
    constructor() {
        super();
        this.currentScope = null;
    }
    visitAssign(root: Assign): void {
        this.visit(root.rightOp);
        this.visit(root.leftOp);
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

    visitNoOp(root: AstNode): void {
    }

    visitNum(root: AstNode): number {
        return 0;
    }

    visitParams(root: AstNode): void {
    }

    visitProcedureDecl(root: ProcedureDecl): void {
        let procedureName = root.procedureName;
        let procedureSymbol = new ProcedureSymbol(procedureName);
        this.currentScope.put(procedureSymbol);
        console.log(`ENTER scope: ${procedureName}`)

        this.currentScope = new ScopedSymbolTable(procedureName, 2, this.currentScope);
        for (let param of root.params) {
            // 找到形参类型对应的类型Symbol
            let typeSymbol: BuiltinTypeSymbol = this.currentScope.lookup(param.typeNode.token.value);
            let paramName = param.varNode.token.value;
            let varSymbol = new VarSymbol(paramName, typeSymbol);
            this.currentScope.put(varSymbol);
            procedureSymbol.params.push(varSymbol);
        }
        this.visit(root.block);
        console.log(this.currentScope.toString());
        // 离开当前节点时候 应该恢复当前当前作用域的父作用域
        this.currentScope = this.currentScope.enclosingScope;
        console.log(`LEAVE scope: ${procedureName}`);


    }

    visitProgram(root: Program): void {
        console.log('ENTER scope: global');
        let global = new ScopedSymbolTable('global', 1, this.currentScope);
        global.initBuiltin(); // 在最顶层初始化内置类型
        this.currentScope = global;
        this.visit(root.block);
        console.log(global.toString());
        this.currentScope = global.enclosingScope;
        console.log("LEAVE scope: global");
    }

    visitType(root: AstNode): void {
    }

    visitUnaryOp(root: AstNode): number {
        return 0;
    }

    visitVar(root: Var): number {
        let name = root.token.value;
        let varSymbol: VarSymbol = this.currentScope.lookup(name);
        if (!varSymbol) {
            throw new Error(`variable ${name} not defined before used`);
        }
        return 0;
    }

    visitVarDecl(root: VarDecl): void {
        let typeSymbol: BuiltinTypeSymbol = this.currentScope.lookup(root.typeNode.token.value);
        let paramName = root.varNode.token.value;
        let varSymbol = new VarSymbol(paramName, typeSymbol);
        this.currentScope.put(varSymbol);
    }

}