import {Type} from "./Constants";

export default class Token {
    type: Type;
    value: string;
    constructor(type: Type, value: string) {
        this.type = type;
        this.value = value;
    }
}