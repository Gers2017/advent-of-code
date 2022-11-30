import { range } from "../utils/extensions.ts";
import { get_input_raw, InputMode } from "../utils/helpers.ts";

const INTERSECTION_COUNT = 12;

export class Vector3 {
    static New(x: number, y: number, z: number) {
        return new Vector3(x, y, z);
    }

    static zero() {
        return Vector3.New(0, 0, 0);
    }

    static from_line(line: string) {
        if (
            !line.includes(",") ||
            line.split("").filter((ch) => ch === ",").length !== 2
        ) {
            throw new Error(
                `Missing ',' separator, expected shape: 'x,y,z'. Your input: ${line}`
            );
        }

        const [x, y, z] = line.split(",").map(Number);
        return Vector3.New(x, y, z);
    }

    constructor(public x: number, public y: number, public z: number) {}

    plus(b: Vector3) {
        return Vector3.New(this.x + b.x, this.y + b.y, this.z + b.z);
    }

    minus(b: Vector3) {
        return Vector3.New(this.x - b.x, this.y - b.y, this.z - b.z);
    }

    translate_to(new_origin: Vector3) {
        return this.minus(new_origin);
    }

    equals(b: Vector3) {
        return this.x === b.x && this.y === b.y && this.z === b.z;
    }

    face(face: number) {
        switch (face) {
            case 0:
                return this;
            case 1:
                return Vector3.New(this.x, -this.y, -this.z);
            case 2:
                return Vector3.New(this.x, -this.z, this.y);
            case 3:
                return Vector3.New(-this.y, -this.z, this.x);
            case 4:
                return Vector3.New(this.y, -this.z, -this.x);
            case 5:
                return Vector3.New(-this.x, -this.z, -this.y);
            default:
                throw new Error("invalid face id");
        }
    }

    rotate(rotate: number) {
        switch (rotate) {
            case 0:
                return this;
            case 1:
                return Vector3.New(-this.y, this.x, this.z);
            case 2:
                return Vector3.New(-this.x, -this.y, this.z);
            case 3:
                return Vector3.New(this.y, -this.x, this.z);
            default:
                throw new Error("invalid rotate id");
        }
    }

    manhattan_distance_to(b: Vector3) {
        return (
            Math.abs(this.x - b.x) +
            Math.abs(this.y - b.y) +
            Math.abs(this.z - b.z)
        );
    }

    to_string() {
        return `${this.x}, ${this.y}, ${this.z}`;
    }
}

export type Scanner = Vector3[];

export function get_scanners(mode: InputMode): Scanner[] {
    const scanners = get_input_raw(mode)
        .split("\n\n")
        .map((text) => text.split("\n"))
        .map((lines) => {
            return lines
                .filter((line) => !line.startsWith("---") && line.length > 0)
                .map(Vector3.from_line);
        });

    return scanners;
}

export type Transform = { scanner_pos: Vector3; points: Vector3[] };

export function new_transform(
    scanner_pos: Vector3,
    points: Vector3[]
): Transform {
    return { scanner_pos, points };
}

export class ScannerSet {
    constructor(
        public id: number,
        public scanner: Scanner,
        public position: Vector3
    ) {}
}

/* Stores a "reference" to a single scanner using the id as index */
export class ScannerRef {
    constructor(public id: number, public position: Vector3) {}
    to_string() {
        return `Ref: ${this.id} position: ${this.position}`;
    }
}

/* ---- solution v2 ---- */

export function intersect(ls: Vector3[], ls2: Vector3[]) {
    return ls.filter((v) => {
        return ls2.some((x) => x.equals(v));
    });
}

export function find_transform_if_intersects(left: Scanner, right: Scanner) {
    for (const face of range(0, 6)) {
        for (const rotation of range(0, 4)) {
            const right_reoriented = right.map((it) =>
                it.face(face).rotate(rotation)
            );

            for (const a of left) {
                for (const b of right_reoriented) {
                    const diff = a.minus(b);
                    const moved = right_reoriented.map((it) => it.plus(diff));

                    if (intersect(moved, left).length >= INTERSECTION_COUNT) {
                        return new_transform(diff, moved);
                    }
                }
            }
        }
    }
    return null;
}

/* ---- manhattan distance ---- */

type ManhattanResult = { highest: number; a: Vector3; b: Vector3 };

export function get_highest_distance(points: Vector3[]): ManhattanResult {
    const result = { a: Vector3.zero(), b: Vector3.zero(), highest: 0 };

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const current = points[i];
            const other = points[j];
            const dist = current.manhattan_distance_to(other);
            if (dist > result.highest) {
                result.a = current;
                result.b = other;
                result.highest = dist;
            }
        }
    }

    return result;
}

// recursive distance
export function get_highest_distance_recursive(points: Vector3[]) {
    const result = { a: Vector3.zero(), b: Vector3.zero(), highest: 0 };
    iter(0, points, result);
    return result;
}

function iter(index: number, values: Vector3[], result: ManhattanResult) {
    // base case
    if (index === values.length - 1) return;

    // pre
    const current_point = values[index];

    for (let j = index + 1; j < values.length; j++) {
        const other = values[j];
        const d = current_point.manhattan_distance_to(other);
        if (d > result.highest) {
            result.highest = d;
            result.a = current_point;
            result.b = other;
        }
    }

    index++;

    // recurse
    iter(index, values, result);
}
