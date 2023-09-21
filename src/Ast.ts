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