"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlpha = exports.isNumber = void 0;
function isNumber(char) {
    return char.length === 1 && char >= '0' && char <= '9';
}
exports.isNumber = isNumber;
function isAlpha(char) {
    return /^[a-zA-Z]/.test(char);
}
exports.isAlpha = isAlpha;
