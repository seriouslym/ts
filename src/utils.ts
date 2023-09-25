export function isNumber(char: string): boolean {
    return char.length === 1 && char >= '0' && char <= '9';
}
export function isAlpha(char: string, first: boolean = false): boolean {
    // 检查首字母 必须是_ 或者是字母
    if (first) {
        return /^[_a-zA-Z]/.test(char);
    }
    // 默认检查_ 字母 数字
    return /^[_a-zA-Z0-9]/.test(char);
}