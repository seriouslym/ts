import Token from "./Token";

export default class AstNode {
    token: Token;
    constructor(token: Token) {
        this.token = token;
    }
}
export class BinOp extends AstNode {
    left: AstNode;
    right: AstNode;
    constructor(token: Token, left: AstNode, right: AstNode) {
        super(token);
        this.left = left;
        this.right = right;
    }
}
export class Num extends AstNode {
    constructor(token: Token) {
        super(token);
    }
}
// 一元运算符 + - 包含自身token 还有其后跟的运算表达式expr
export class UnaryOp extends AstNode {
    expr: AstNode;
    constructor(token: Token, expr: AstNode) {
        super(token);
        this.expr = expr;
    }
}

/*
    pascal的复合语句由Begin statements end组成
    其中statements由多条statement表示 最后一条statement后可以不加分号
    statement包含赋值 | 空 | 复合语句（Begin嵌套）
 */
export class Compound extends AstNode {
    children: AstNode[];
    constructor() {
        super(null);
        this.children = [];
    }
}

export class Assign extends AstNode {
    leftOp: AstNode; // 赋值左边操作数
    rightOp: AstNode; // 赋值右边操作数
    constructor(token: Token, leftOp: AstNode, rightOp: AstNode) {
        super(token);
        this.leftOp = leftOp;
        this.rightOp = rightOp;
    }
}

export class Var extends AstNode {
    constructor(token: Token) {
        super(token);
    }
}
export class NoOp extends AstNode {
    constructor() {
        super(null);
    }
}

export class Program extends AstNode {
    name: string;
    block: Block;
    constructor(name: string, block: Block) {
        super(null);
        this.name = name;
        this.block = block;
    }
}

export class Block extends AstNode {
    constructor(declarations: VarDecl[], compound: Compound) {
        super(null);
        this.declarations = declarations;
        this.compound = compound;
    }
    declarations: VarDecl[]; // 声明语句
    compound: Compound; // 复合语句

}
export class VarDecl extends AstNode {
    varNode: Var;
    typeNode: TypeNode;
    constructor(varNode: Var, typeNode: TypeNode) {
        super(null);
        this.varNode = varNode;
        this.typeNode = typeNode;
    }
}
export class TypeNode extends AstNode {
    // Token(Type.REAL, "REAL")
    // Token(Type.INTEGER, "INTEGER")
    constructor(token: Token) {
        super(token);
    }
}