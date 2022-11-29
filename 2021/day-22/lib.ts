export class Cuboid {
    constructor(
        public isOn: boolean,
        public xRange: Range,
        public yRange: Range,
        public zRange: Range
    ) {}

    isIntersect(other: Cuboid) {
        return (
            intersects_with(this.xRange, other.xRange) &&
            intersects_with(this.yRange, other.yRange) &&
            intersects_with(this.zRange, other.zRange)
        );
    }

    intersect(other: Cuboid) {
        if (!this.isIntersect(other)) return null;

        return new_cuboid(
            !this.isOn,
            intersect(this.xRange, other.xRange),
            intersect(this.yRange, other.yRange),
            intersect(this.zRange, other.zRange)
        );
    }

    volume() {
        return (
            size(this.xRange) *
            size(this.yRange) *
            size(this.zRange) *
            (this.isOn ? 1 : -1)
        );
    }
}

export type Cuboids = Cuboid[];

export function new_cuboid(
    isOn: boolean,
    xRange: Range,
    yRange: Range,
    zRange: Range
): Cuboid {
    return new Cuboid(isOn, xRange, yRange, zRange);
}

export type Range = { from: number; to: number };

export function new_range(from: number, to: number): Range {
    return { from, to };
}

export function intersect(a: Range, b: Range) {
    return new_range(Math.max(a.from, b.from), Math.min(a.to, b.to));
}

export function intersects_with(a: Range, b: Range) {
    return a.from <= b.to && a.to >= b.from;
}

export function size(it: Range) {
    return it.to - it.from + 1;
}
