interface Math {
    clamp(x: number, min: number, max: number): number
    randint(min: number, max: number): number
}

Math.clamp = function (x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max)
}

Math.randint = function (min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
