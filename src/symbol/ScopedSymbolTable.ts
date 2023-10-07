import {BuiltinTypeSymbol, MySymbol, ProcedureSymbol} from "./MySymbol";

// 每一个scope都有一个对应的ScopeSymbolTable
export class ScopedSymbolTable {
    symbols: Map<string, MySymbol>; // 字典 key:name value: MySymbol
    scopeName: string;
    scopeLevel: number;
    enclosingScope: ScopedSymbolTable; // 父作用域（嵌套作用域）

    constructor(scopeName: string, scopeLevel: number, enclosingScope: ScopedSymbolTable = null) {
        this.scopeName = scopeName;
        this.scopeLevel = scopeLevel;
        this.enclosingScope = enclosingScope;
        this.symbols = new Map<string, MySymbol>();
    }
    initBuiltin(): void {
        this.put(new BuiltinTypeSymbol("INTEGER"));
        this.put(new BuiltinTypeSymbol("REAL"));
    }
    put(symbol: MySymbol) {
        console.log(`Define: ${symbol.name}`)
        this.symbols.set(symbol.name, symbol);
    }
    lookup(name: string): MySymbol {
        let cur: ScopedSymbolTable = this;
        while (cur !== null) {
            console.log(`Lookup: ${name} in ${cur.scopeName}`);
            let s = cur.symbols.get(name);
            if (s) return s;
            cur = cur.enclosingScope;
        }
        // 到program顶层都没找到定义 返回null
        return null;
        // console.log(`Lookup: ${name} in ${this.scopeName}`);
        //
        // let symbol = this.symbols.get(name);
        // // 当前作用域查找
        // if (symbol) {
        //     return symbol;
        // }
        // // 向上
        // if (this.enclosingScope !== null) {
        //     return this.enclosingScope.lookup(name);
        // }
        // 到顶
        // return null;
    }

    toString(): string {
        let scope = `SCOPE: \n   Scope name: ${this.scopeName}\n   Scope level: ${this.scopeLevel}\n   Enclosing scope: ${this.enclosingScope ? this.enclosingScope.scopeName : null}\n`;
        let symbols = Array.from(this.symbols.entries()).map(([key, value]) => {
            return key + ": " + value.toString();
        }).join('\n   ');
        return scope + `SYMBOLS: \n   ${symbols}`;
    }
}