import { range, for_range } from "../utils/extensions.ts";

export type Scanner = Vector3[];

export class Vector3 {
    static New(x: number, y: number, z: number) {
        return new Vector3(x, y, z);
    }

    static from_line(line: string) {
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
    private _points: Vector3[] = [];
    private _register: Set<string> = new Set();
    constructor(scanner: Scanner) {
        scanner.forEach((point) => {
            this.register_point(point);
        });
    }

    get points() {
        return this._points;
    }

    has_point(point: Vector3) {
        return this._register.has(point.to_string());
    }

    private register_point(point: Vector3) {
        this._register.add(point.to_string());
        this._points.push(point);
    }

    append(point: Vector3) {
        if (!this.has_point(point)) {
            point.plus(point);
            this.register_point(point);
        }
    }

    add_all_points(points: Vector3[]) {
        points.forEach((point) => this.append(point));
    }

    remove(point: Vector3) {
        if (this.has_point(point)) {
            this._register.delete(point.to_string());
        }
    }
}

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

export type Transform = { scanner_pos: Vector3; points: Vector3[] };

export function new_transform(
    scanner_pos: Vector3,
    points: Vector3[]
): Transform {
    return { scanner_pos, points };
}
