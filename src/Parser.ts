import Lexer from "./Lexer";
import Token from "./Token";
import {Type} from "./Constants";
import AstNode, {
    Assign,
    BinOp,
    Block,
    Compound,
    DeclNode,
    NoOp,
    Num, Param, ProcedureDecl,
    Program,
    TypeNode,
    UnaryOp,
    Var,
    VarDecl
} from "./ast/AstNode";

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
            if (token.type === Type.INTEGER_CONST) {
                this.eat(Type.INTEGER_CONST);
                return new Num(token);
            } else if (token.type === Type.REAL_CONST) {
                this.eat(Type.REAL_CONST);
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
     * PROGRAM variable semi block dot
     */
    program(): AstNode {
        this.eat(Type.PROGRAM);
        // 获取pascal程序名称
        let programName = this.variable().token.value;
        this.eat(Type.SEMI);
        let blockNode = this.block();
        this.eat(Type.DOT);
        return new Program(programName, blockNode);
    }
    //
    block(): Block {
        let declarations: DeclNode[] = this.declarations();
        let compound = this.compoundStatement();
        return new Block(declarations, compound);
    }
    // 1、VAR (variable_declaration SEMI)+ | empty     var a,b,c : integer;  变量声明
    // 2、(PROCEDURE ID SEMI block SEMI)*              procedure p1; block semi; 过程声明
    // 3、合并 VAR (variable_declaration SEMI)+ | (PROCEDURE ID SEMI block SEMI)* | empty
    declarations(): DeclNode[]{
        let res: DeclNode[] = [];
        // 变量声明
        if (this.currentToken.type === Type.VAR) {
            this.eat(Type.VAR);
            // @ts-ignore
            while (this.currentToken.type === Type.ID) {
                res = [...res, ...this.variableDeclaration()];
                this.eat(Type.SEMI);
            }
        }
        // 过程声明
        while (this.currentToken.type === Type.PROCEDURE) {
            this.eat(Type.PROCEDURE);
            let procedureName = this.currentToken.value;
            this.eat(Type.ID);
            let params = this.formalParams();
            console.log("procedure params", params);
            // params.forEach(param => {
            //     console.log(param.varNode.token.value, param.typeNode.token.value)
            // })
            this.eat(Type.SEMI);
            let block = this.block();
            console.log("procedure block", block);
            res = [...res, new ProcedureDecl(procedureName, block, params)];
        }
        // while (this.currentToken.type === Type.PROCEDURE) {
        //     this.eat(Type.PROCEDURE);
        //     let procedureName = this.currentToken.value;
        //     this.eat(Type.ID);
        //     this.eat(Type.SEMI);
        //     let block = this.block();
        //     res = [...res, new ProcedureDecl(procedureName, block, null)];
        //     this.eat(Type.SEMI);
        // }
        return res;
    }

    formalParams(): Param[] {
        let res: Param[] = null;
        // console.log(res, this.currentToken);
        if (this.currentToken.type === Type.LEFT_BRACKET) {
            this.eat(Type.LEFT_BRACKET);
            res = this.paramsList();
            this.eat(Type.RIGHT_BRACKET);
        }
        return res;
    }
    paramsList(): Param[] {
        let res = this.param();
        console.log("params", res)
        while (this.currentToken.type === Type.SEMI) {
            this.eat(Type.SEMI);
            res = [...res, ...this.paramsList()];
        }
        return res;
    }

    param(): Param[] {
        let res: VarDecl[] = this.variableDeclaration();
        return res.map(v => new Param(v.varNode, v.typeNode));
    }



    // ID (COMMA ID)* COLON type
    //
    variableDeclaration(): VarDecl[] {
        let variables: Var[] = [this.variable()];
        while (this.currentToken.type === Type.COMMA) {
            this.eat(Type.COMMA);
            variables.push(this.variable());
        }
        this.eat(Type.COLON);
        let type = this.typeSpec();
        return variables.map(item => {
            return new VarDecl(item, type);
        })

    }
    typeSpec(): TypeNode {
        let type = this.currentToken;
        if (this.currentToken.type === Type.INTEGER) {
            this.eat(Type.INTEGER);
        } else {
            this.eat(Type.REAL);
        }
        return new TypeNode(type);
    }
    /**
     * BEGIN
     *     statements
     * END.
     */
    compoundStatement(): Compound{
        try {
            this.eat(Type.BEGIN);
            let node = this.statementList();
            this.eat(Type.END);
            let root = new Compound();
            // if (this.currentToken.type === Type.SEMI) {
            //     this.eat(Type.SEMI);
            // }
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

    variable(): Var {
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