import {type} from "os";
import {Param} from "../AstNode";

// 与系统Symbol命名冲突
export class MySymbol {
    name: string;
    type: MySymbol;

    constructor(name: string, type: MySymbol) {
        this.name = name;
        this.type = type;
    }


}

// 内置类型
export class BuiltinTypeSymbol extends MySymbol {
    constructor(name: string) {
        super(name, null);
    }
    toString(): string {
        return `<${this.constructor.name}(name='${this.name}')>`
    }

}

export class VarSymbol extends MySymbol {
    constructor(name: string, type: MySymbol) {
        super(name, type);
    }
    toString(): string {
        return `<${this.constructor.name}(name='${this.name}', type='${this.type.name}'>`
    }
}

export class ProcedureSymbol extends MySymbol {
    params: VarSymbol[];  // 保存指向形参的Symbol
    constructor(name: string, params: VarSymbol[] = []) {
        super(name, null);
        this.params = params;
    }
    toString(): string {
        return `<${this.constructor.name}(name='${this.name}', parameters=[${this.params.toString()}]'>`;
    }

}