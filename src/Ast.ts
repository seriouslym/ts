import Token from "./Token";

export default class AstNode {
    token: Token;
    left: AstNode;
    right: AstNode;
    constructor(token: Token, left: AstNode = null, right: AstNode = null) {
        this.token = token;
        this.left = left;
        this.right = right;
    }
}