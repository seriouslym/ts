import {BuiltinTypeSymbol, MySymbol} from "./MySymbol";

export class SymbolTable {
    symbols: Map<string, MySymbol>; // 字典 key:name value: MySymbol
    constructor() {
        this.symbols = new Map<string, MySymbol>();
        this.put(new BuiltinTypeSymbol("INTEGER"));
        this.put(new BuiltinTypeSymbol("REAL"));
    }

    put(symbol: MySymbol) {
        console.log(`Define: ${symbol.toString()}`)
        this.symbols.set(symbol.name, symbol);
    }
    get(name: string): MySymbol {
        console.log(`Lookup: ${name}`);
        let symbol = this.symbols.get(name);
        return  symbol ? symbol : null;
    }

    toString(): string {
        let symbols = Array.from(this.symbols.entries()).map(([key, value]) => {
            return key + ": " + value.toString();
        }).join('\n   ');
        return `SYMBOLS: \n   ${symbols}`;
    }

}