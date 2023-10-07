import NodeVisitor from "./NodeVisitor";
import AstNode, {
    Assign,
    BinOp,
    Block,
    Compound,
    NoOp,
    Num, Param,
    ProcedureDecl,
    Program,
    TypeNode,
    UnaryOp,
    VarDecl
} from "../AstNode";
import Parser from "../Parser";

export class GenerateDot extends NodeVisitor{
    parse: Parser;
    content: string[];
    header: string;
    footer: string;
    label: number
    constructor(parse: Parser) {
        super();
        this.parse = parse
        this.content = [];
        this.header = "digraph astgraph { \n" +
            "node [shape=circle, fontsize=12, fontname=\"Courier\", height=.1]; \n" +
            "ranksep=.3;\n" +
            "edge [arrowsize=.5]\n"
        this.footer = "\n}";
        this.label = 1; // 节点的编号
    }
    visitAssign(root: Assign): void {
        let i = this.label;
        this.content.push(`node${i} [label="${root.token.value}"]`);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.leftOp);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.rightOp);
    }

    visitBinOp(root: BinOp): number {
        let i = this.label;
        this.content.push(`node${i} [label="${root.token.value}"]`);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.left);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.right);
        return 0;
    }

    visitCompound(root: Compound): void {
        let i = this.label;
        this.content.push(`node${i} [label="Compound"]`);
        for (let j = 0; j < root.children.length; j++) {
            this.label++;
            this.content.push(`node${i} -> node${this.label}`);
            this.visit(root.children[j]);
        }
    }

    visitNoOp(root: NoOp): void {
        this.content.push(`node${this.label} [label="NoOp"]`);
        this.label++;
    }

    visitNum(root: Num): number {
        this.content.push(`node${this.label} [label="${root.token.value}"]`);
        this.label++;
        return 0;
    }

    visitUnaryOp(root: UnaryOp): number {
        let i = this.label;
        this.content.push(`node${i} [label="Unary${root.token.value}"]`);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.expr);
        return 0;
    }

    visitVar(root: AstNode): number {
        this.content.push(`node${this.label} [label="${root.token.value}"]`);
        this.label++;
        return 0;
    }

    visitBlock(root: Block): void {
        let i = this.label;
        this.content.push(`node${this.label} [label="Block"]`);
        for (let j = 0; j < root.declarations.length; j++) {
            this.label++;
            this.content.push(`node${i} -> node${this.label}`);
            this.visit(root.declarations[j]);
        }
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.compound);
    }

    visitProgram(root: Program): void {
        let i = this.label;
        this.content.push(`node${this.label} [label="Program-${root.name}"]`);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.block);
    }

    visitType(root: TypeNode): void {
        this.content.push(`node${this.label} [label="${root.token.value}"]`);
        this.label++;
    }

    visitVarDecl(root: VarDecl|Param): void {
        let i = this.label;
        this.content.push(`node${this.label} [label="${root instanceof VarDecl ? "VarDecl" : "Param"}"]`);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.varNode);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.typeNode);
    }
    dot(): string {
        let root = this.parse.program();
        this.visit(root);
        console.log(this.content)
        return this.header + this.content.join('\n') + this.footer;
    }

    visitProcedureDecl(root: ProcedureDecl): void {
        let i = this.label;
        this.content.push(`node${this.label} [label="ProceDel: ${root.procedureName}"]`);
        this.label++;
        this.content.push(`node${i} -> node${this.label}`);
        this.visit(root.block);
        for (let j = 0; j < root.params.length; j++) {
            this.label++;
            this.content.push(`node${i} -> node${this.label}`);
            this.visit(root.params[j]);
        }
    }

    visitParams(root: Param) {
        this.visitVarDecl(root);

    }
}