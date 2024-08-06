interface Math {
    clamp(x: number, min: number, max: number): number
}

Math.clamp = function (x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max)
}