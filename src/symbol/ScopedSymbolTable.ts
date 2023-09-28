import {BuiltinTypeSymbol, MySymbol} from "./MySymbol";

export class ScopedSymbolTable {
    symbols: Map<string, MySymbol>; // 字典 key:name value: MySymbol
    scopeName: string;
    scopeLevel: number;

    constructor() {
        this.symbols = new Map<string, MySymbol>();

    }
    initBuiltin(): void {
        this.put(new BuiltinTypeSymbol("INTEGER"));
        this.put(new BuiltinTypeSymbol("REAL"));
    }
    put(symbol: MySymbol) {
        console.log(`Define: ${symbol.toString()}`)
        this.symbols.set(symbol.name, symbol);
    }
    lookup(name: string): MySymbol {
        console.log(`Lookup: ${name}`);
        let symbol = this.symbols.get(name);
        return  symbol ? symbol : null;
    }

    toString(): string {
        let scope = `SCOPE: \n   Scope name: ${this.scopeName}\n   Scope level: ${this.scopeLevel}\n`
        let symbols = Array.from(this.symbols.entries()).map(([key, value]) => {
            return key + ": " + value.toString();
        }).join('\n   ');
        return `SYMBOLS: \n   ${symbols}`;
    }
}