"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = void 0;
function isNumber(char) {
    return char.length === 1 && char >= '0' && char <= '9';
}
exports.isNumber = isNumber;
