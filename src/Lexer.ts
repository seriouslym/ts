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
    // 解析 整数 或者浮点数
    number(): Token {
        let start = this.pos;
        while (this.currentChar !== null && isNumber(this.currentChar)) {
            this.advance();
        }
        if (this.currentChar === '.') {
            this.advance();
            while (this.currentChar !== null && isNumber(this.currentChar)) {
                this.advance();
            }
            return new Token(Type.REAL_CONST, this.text.slice(start, this.pos));
        }
        return new Token(Type.INTEGER_CONST, this.text.slice(start, this.pos));;
    }
    // 忽略pascal注释 {这是注释}
    skipComment(): void {
        while (this.currentChar !== '}') {
            this.advance();
        }
        this.advance();
    }
    // 解析变量名
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
            } else if (this.currentChar === '{') {
                this.advance();
                this.skipComment();
                continue;
            } else if (isAlpha(this.currentChar, true)) {
                let id = this.id();
                return RESERVED_KEYWORDS[id] ?? new Token(Type.ID, id);
            } else if (isNumber(this.currentChar)) {
                return this.number();
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
            } else if (this.currentChar === ':') {
                this.advance();
                return new Token(Type.COLON, ':');
            } else if (this.currentChar === ',') {
                this.advance();
                return new Token(Type.COMMA, ',');
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