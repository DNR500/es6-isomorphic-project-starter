import template from './sampletemplate.html';

export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    let num = v => v + 1;
    return sqrt(square(x) + square(y) + num);
}
export function sayHi() {
    alert(template());
}