import { range, for_range, first_or_null } from "../utils/extensions.ts";
import { get_input_raw, InputMode } from "../utils/helpers.ts";

export type Scanner = Vector3[];

export type Memory = Map<string, Vector3>;

export type SolutionResult = {
    scanner_positions: Vector3[];
    beacons: Vector3[];
};

export type ManhattanResult = { highest: number; a: Vector3; b: Vector3 };

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

export function get_scanner_input(mode: InputMode) {
    const scanners = get_input_raw(mode)
        .split("\n\n")
        .map((text) => text.split("\n"))
        .map((lines) => scanner_from_lines(lines));

    return scanners;
}

export function scanner_from_lines(lines: string[]): Scanner {
    return lines
        .filter((line) => !line.startsWith("---") && line.length > 0)
        .map((line) => Vector3.from_line(line));
}

const roll = (v: Vector3) => Vector3.New(v.x, v.z, -v.y);

const turn = (v: Vector3) => Vector3.New(-v.y, v.x, v.z);

function* sequence(v: Vector3) {
    for (const cycle of range(0, 2)) {
        for (const step of range(0, 3)) {
            v = roll(v);
            yield v;
            for (const i of range(0, 3)) {
                v = turn(v);
                yield v;
            }
        }
        v = roll(turn(roll(v)));
    }
}

export function get_24_orientations_of_point(v: Vector3) {
    return for_range(sequence(v));
}

export function intersect(ls: Vector3[], ls2: Vector3[]) {
    return ls.filter((v) => {
        return ls2.some((x) => x.equals(v));
    });
}

export class Register {
    points: Vector3[] = [];
    private set: Set<string> = new Set();

    constructor(scanner: Scanner) {
        scanner.forEach((point) => {
            this.register_point(point);
        });
    }

    has_point(point: Vector3) {
        return this.set.has(point.to_string());
    }

    private register_point(point: Vector3) {
        this.set.add(point.to_string());
        this.points.push(point);
    }

    register(point: Vector3) {
        if (!this.has_point(point)) {
            // point.plus(point);
            this.register_point(point);
        }
    }

    register_all_points(points: Vector3[]) {
        points.forEach((point) => this.register(point));
    }

    unregister(point: Vector3) {
        if (this.has_point(point)) {
            this.set.delete(point.to_string());
        }
    }
}

export type Transform = { scanner_pos: Vector3; points: Vector3[] };

export function new_transform(
    scanner_pos: Vector3,
    points: Vector3[]
): Transform {
    return { scanner_pos, points };
}

/* ---- solution v1 ---- */

export function get_moved_scanners(scanner: Scanner): Scanner[] {
    const moved_scanner = scanner.map((point) =>
        get_24_orientations_of_point(point)
    );
    const columns = [];
    for (let j = 0; j < moved_scanner[0].length; j++) {
        const column = moved_scanner.map((scanner) => scanner[j]);
        columns.push(column);
    }
    return columns;
}

export function get_transform_overlap(
    base_scanner: Scanner,
    right_scanner: Scanner
) {
    return first_or_null(base_scanner, (s1) => {
        return first_or_null(right_scanner, (s2) => {
            const diff = s1.minus(s2);
            const translated = right_scanner.map((x) => x.plus(diff));
            if (intersect(translated, base_scanner).length >= 12) {
                return new_transform(diff, translated);
            }
            return null;
        });
    });
}

export function get_transform_from_moved_scanners(
    base_scanner: Register,
    moved_scanners: Scanner[]
) {
    for (const moved_scanner of moved_scanners) {
        const transform = get_transform_overlap(
            base_scanner.points,
            moved_scanner
        );

        if (transform) {
            return transform;
        }
    }

    return null;
}

/* ---- solution v2 ---- */

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

                    if (intersect(moved, left).length >= 12) {
                        return new_transform(diff, moved);
                    }
                }
            }
        }
    }
    return null;
}

/* ---- solution v3 ---- */

export class ScannerSet {
    constructor(
        public id: number,
        public scanner: Scanner,
        public position: Vector3
    ) {}
}

export function intersect_fs(list_a: Vector3[], list_b: Vector3[]) {
    const result: Vector3[] = [];
    for (let i = 0; i < list_a.length; i++) {
        const a = list_a[i];
        for (let j = 0; j < list_b.length; j++) {
            const b = list_b[j];
            if (a.equals(b)) {
                result.push(a);
            }
        }
    }

    return result;
}

export function find_transform(left: Scanner, right: Scanner, memory?: Memory) {
    for (const face of range(0, 6)) {
        for (const rotation of range(0, 4)) {
            const new_right = right.map((it) => {
                const id = it.to_string();
                if (memory && memory.has(id)) return memory.get(id)!;
                const n = it.face(face).rotate(rotation);
                memory && memory.set(id, n);
                return n;
            });

            for (const a of left) {
                for (const b of new_right) {
                    const diff = a.minus(b);
                    const moved = new_right.map((it) => it.plus(diff));

                    if (intersect(moved, left).length >= 12) {
                        return new_transform(diff, moved);
                    }
                }
            }
        }
    }

    return null;
}

/* ---- manhattan distance ---- */

export function get_highest_manhattan_distance(scanner_points: Vector3[]) {
    let highest = 0;
    let points = { a: Vector3.New(0, 0, 0), b: Vector3.New(0, 0, 0) };
    const checked = new Set<string>();

    for (const a of scanner_points) {
        const to_check = scanner_points.filter(
            (x) => !checked.has(x.to_string()) && !x.equals(a)
        );

        for (const b of to_check) {
            const distance = a.manhattan_distance_to(b);
            if (distance > highest) {
                highest = distance;
                points = { a, b };
            }
        }

        checked.add(a.to_string());
    }

    console.log("From points:", points);
    console.log("Highest distance is:", highest);
}

// recursive distance
export function get_highest_distance(points: Vector3[]) {
    const result = { a: Vector3.zero(), b: Vector3.zero(), highest: 0 };
    walk(0, points, result);
    return result;
}

export function walk(
    index: number,
    values: Vector3[],
    result: ManhattanResult
) {
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
    walk(index, values, result);
}
