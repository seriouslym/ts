import {Type} from "./Type";
import Token from "./Token";
import {isNumber} from "./utils";
import AstNode from "./Ast";

class Interpreter {
    text: string;
    pos: number;
    currentChar: string;
    currentToken: Token;
    constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text.charAt(this.pos);
        this.currentToken = this.getNextToken();
    }
    advance(): void {
        this.pos++;
        if (this.pos >= this.text.length) {
            this.currentChar = null;
        } else {
            this.currentChar = this.text.charAt(this.pos);
        }
    }
    skipWhitespace(): void {
        while (this.pos !== null && this.currentChar === ' ') {
            this.advance();
        }
    }

    getNextToken(): Token {
        while (this.currentChar != null) {
            if (this.currentChar === ' ') {
                this.skipWhitespace();
                continue;
            } else if (isNumber(this.currentChar)) {
                let start = this.pos;
                while (this.currentChar !== null && isNumber(this.currentChar)) {
                    this.advance();
                }
                return new Token(Type.INTEGER, this.text.slice(start, this.pos));
            } else if (this.currentChar === '+') {
                this.advance();
                return new Token(Type.PLUS, "+");
            } else if (this.currentChar === '-') {
                this.advance();
                return new Token(Type.MINUS, "-");
            } else if (this.currentChar === '*') {
                this.advance();
                return new Token(Type.MUL, "*");
            } else if (this.currentChar === '/') {
                this.advance();
                return new Token(Type.DIV, "/");
            } else if (this.currentChar === '(') {
                this.advance();
                return new Token(Type.LEFT_BRACKET, '(');
            } else if (this.currentChar === ')') {
                this.advance();
                return new Token(Type.RIGHT_BRACKET, ')')
            }
            throw new Error(`Invalid Character ${this.pos} ${this.currentChar}`);
        }
        return new Token(Type.EOF, null);
    }

    // getTokens(): Token[] {
    //     let res: Token[] = [];
    //     while (this.currentChar !== null) {
    //         res.push(this.getNextToken());
    //     }
    //     return res;
    // }
    eat(type: Type) {
        if (this.currentToken.type === type) {
            this.currentToken = this.getNextToken();
        } else {
            throw new Error("parse error");
        }
    }
    factor(): AstNode {
        let token = this.currentToken;
        try {
            if (token.type === Type.INTEGER) {
                this.eat(Type.INTEGER);
                return new AstNode(token);
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
            node = new AstNode(token, node, this.factor());
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
            node = new AstNode(token, node, this.term());
        }
        return node;
    }

}

let interpreter = new Interpreter("1 - 2 * 2    ");
console.log(interpreter.expr());







