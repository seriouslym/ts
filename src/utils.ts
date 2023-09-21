export function isNumber(char: string): boolean {
    return char.length === 1 && char >= '0' && char <= '9';
}
export function isAlpha(char: string): boolean {
    return /^[a-zA-Z]/.test(char);
}