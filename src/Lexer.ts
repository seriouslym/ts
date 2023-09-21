import Token from "./Token";
import {isNumber} from "./utils";
import {Type} from "./Type";

// 也可以称为 Tokenizer
export default class Lexer {
    text: string;
    pos: number;
    currentChar: string;
    constructor(text: string) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text.charAt(this.pos);
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


}