import Lexer from "./Lexer";
import Token from "./Token";
import {Type} from "./Type";
import AstNode, {BinOp, Num} from "./Ast";

// 根据tokenizer得到的token 进行parse得到ast
export default class Parser {
    lexer: Lexer;
    currentToken: Token;
    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }
    eat(type: Type) {
        if (this.currentToken.type === type) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            throw new Error("parse error");
        }
    }
    factor(): AstNode {
        let token = this.currentToken;
        try {
            if (token.type === Type.INTEGER) {
                this.eat(Type.INTEGER);
                return new Num(token);
            } else if (token.type === Type.LEFT_BRACKET) {
                this.eat(Type.LEFT_BRACKET);
                let node = this.expr();
                this.eat(Type.RIGHT_BRACKET);
                return node;
            }
        } catch (e) {
            console.log(e);
        }
    }
    term(): AstNode {
        let node = this.factor();
        while ([Type.MUL, Type.DIV].indexOf(this.currentToken.type) !== -1) {
            let token = this.currentToken;
            if (this.currentToken.type === Type.MUL) {
                this.eat(Type.MUL);
            } else {
                this.eat(Type.DIV);
            }
            node = new BinOp(token, node, this.factor());
        }
        return node;
    }
    expr(): AstNode {
        let node = this.term();
        while ([Type.PLUS, Type.MINUS].indexOf(this.currentToken.type) !== -1) {
            let token = this.currentToken;
            if (this.currentToken.type === Type.PLUS) {
                this.eat(Type.PLUS);
            } else {
                this.eat(Type.MINUS);
            }
            node = new BinOp(token, node, this.term());
        }
        return node;
    }
}