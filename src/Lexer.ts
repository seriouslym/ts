import Token from "./Token";
import {isAlpha, isNumber} from "./utils";
import {RESERVED_KEYWORDS, Type} from "./Constants";

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
        while (this.pos !== null && (this.currentChar === ' ' || this.currentChar === '\n')) {
            this.advance();
        }
    }
    integer(): string {
        let start = this.pos;
        while (this.currentChar !== null && isNumber(this.currentChar)) {
            this.advance();
        }
        return this.text.slice(start, this.pos);
    }
    id(): string {
        let start = this.pos;
        while (this.currentChar !== null && isAlpha(this.currentChar)) {
            this.advance();
        }
        return this.text.slice(start, this.pos).toUpperCase();
    }
    // 查看下一个pos位置的字符，但pos并不增加
    peek(): string {
        if (this.pos + 1 < this.text.length) {
            return this.text.charAt(this.pos + 1);
        }
        return null;
    }
    getNextToken(): Token {
        while (this.currentChar != null) {
            if (this.currentChar === ' ' || this.currentChar === '\n') {
                this.skipWhitespace();
                continue;
            } else if (isAlpha(this.currentChar)) {
                let id = this.id();
                return RESERVED_KEYWORDS[id] ?? new Token(Type.ID, id);
            } else if (isNumber(this.currentChar)) {
                return new Token(Type.INTEGER, this.integer());
            } else if (this.currentChar === ':' && this.peek() === '=') {
                this.advance();
                this.advance();
                return new Token(Type.ASSIGN, ':=');
            } else if (this.currentChar === ';') {
                this.advance();
                return new Token(Type.SEMI, ";");
            } else if (this.currentChar === '.') {
                this.advance();
                return new Token(Type.DOT, ".");
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
                return new Token(Type.DIVIDE, "/");
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

    // 测试
    getTokens(): Token[] {
        let res: Token[] = [];
        while (this.currentChar !== null) {
            res.push(this.getNextToken());
        }
        this.pos = 0;
        this.currentChar = this.text.charAt(this.pos);
        return res;
    }


}