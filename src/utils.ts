export function isNumber(char: string): boolean {
    return char.length === 1 && char >= '0' && char <= '9';
}
export function isAlpha(char: string): boolean {
    return /^[_a-zA-Z]/.test(char);
}