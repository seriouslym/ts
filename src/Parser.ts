import Lexer from "./Lexer";
import Token from "./Token";
import {Type} from "./Constants";
import AstNode, {Assign, BinOp, Compound, NoOp, Num, UnaryOp, Var} from "./AstNode";

// 根据tokenizer得到的token 进行parse得到ast
export default class Parser {
    lexer: Lexer;
    currentToken: Token;
    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }
    error(): Error {
        throw new Error('parse error');
    }
    eat(type: Type) {
        if (this.currentToken.type === type) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error();
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
            } else if (token.type === Type.PLUS) {
                this.eat(Type.PLUS);
                return new UnaryOp(token, this.factor());
            } else if (token.type === Type.MINUS) {
                this.eat(Type.MINUS)
                return new UnaryOp(token, this.factor());
            } else {
                return this.variable();
            }
        } catch (e) {
            console.log(e);
        }
    }
    term(): AstNode {
        let node = this.factor();
        while ([Type.MUL, Type.DIV, Type.DIVIDE].indexOf(this.currentToken.type) !== -1) {
            let token = this.currentToken;
            if (this.currentToken.type === Type.MUL) {
                this.eat(Type.MUL);
            } else if (this.currentToken.type === Type.DIV){
                this.eat(Type.DIV);
            } else {
                this.eat(Type.DIVIDE);
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

    /**
     * compound dot
     */
    program(): AstNode {
        let node = this.compoundStatement();
        this.eat(Type.DOT);
        return node;
    }

    /**
     * BEGIN
     *     statements
     * END.
     */
    compoundStatement(): AstNode{
        try {
            this.eat(Type.BEGIN);
            let node = this.statementList();
            this.eat(Type.END);
            let root = new Compound();
            for (let i = 0; i < node.length; i++) {
                root.children.push(node[i]);
            }
            return root;
        }catch (e) {
            console.log(e)
        }
    }

    /**
     * statement | statement; statements
     */
    statementList(): AstNode[] {
        let node: AstNode[];
        node = [this.statement()];
        while (this.currentToken.type === Type.SEMI) {
            this.eat(Type.SEMI);
            node = [...node, this.statement()];
        }
        if (this.currentToken.type === Type.ID) {
            this.error();
        }
        return node;
    }

    /**
     * BEGIN
     *     BEGIN
     *         number := 2;
     *         a := number;
     *         b := 10 * a + 10 * number / 4;
     *         c := a - - b
     *     END; statement
     *     x := 11; statement
     * END.
     */
    statement(): AstNode {
        let node: AstNode;
        if (this.currentToken.type === Type.BEGIN) {
            node = this.compoundStatement();
        } else if (this.currentToken.type === Type.ID) {
            node = this.assignStatement();
        } else {
            node = this.empty();
        }
        return node;
    }
    assignStatement(): AstNode {
        try {
            let left = this.variable();
            let token = this.currentToken;
            this.eat(Type.ASSIGN);
            let right = this.expr();
            return new Assign(token, left, right);
        } catch (e) {
            console.log(e);
        }
    }

    variable(): AstNode {
        try {
            let node = new Var(this.currentToken);
            this.eat(Type.ID);
            return node;
        } catch (e) {
            console.log(e);
        }
    }


    empty(): AstNode {
        return new NoOp();
    }
    parse(): AstNode {
        let node = this.program();
        if (this.currentToken.type !== Type.EOF) {
            this.error();
        }
        return node;
    }
}