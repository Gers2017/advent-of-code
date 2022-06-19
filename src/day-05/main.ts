import { get_input } from "../utils/helpers.ts";

class Point {
    constructor(public x: number, public y: number) {}
    static New(x: number, y: number) {
        return new Point(x, y);
    }

    plus(other: Point) {
        return Point.New(
            Math.round(this.x + other.x),
            Math.round(this.y + other.y)
        );
    }

    equals(other: Point) {
        return this.x == other.x && this.y == other.y;
    }

    copy() {
        return Point.New(this.x, this.y);
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalized() {
        const magnitude = this.magnitude();
        return Point.New(this.x / magnitude, this.y / magnitude);
    }

    is_aligned_with(other: Point) {
        return this.x == other.x || this.y == other.y;
    }

    direction_to(b: Point): Point {
        return new Point(b.x - this.x, b.y - this.y).normalized();
    }

    to_string() {
        return `${this.x},${this.y}`;
    }
}

class Segment {
    constructor(public from: Point, public to: Point) {}
    static New(line: string) {
        const line_split = line.split(" -> ");
        const points = line_split.reduce<Point[]>((ls, item) => {
            const [x, y] = item.split(",").map(Number);
            return [...ls, Point.New(x, y)];
        }, []);

        const [from, to] = points;
        return new Segment(from, to);
    }

    get all_points() {
        const dir = this.from.direction_to(this.to);
        let point = this.from.copy();
        const point_list = [point];

        while (!point.equals(this.to)) {
            point = point.plus(dir);
            point_list.push(point);
        }

        return point_list;
    }

    get linear_points() {
        if (this.from.is_aligned_with(this.to)) {
            return this.all_points;
        }
        return [];
    }
}

function solve(segments: Segment[], use_diagonals: boolean) {
    const record: Record<string, number> = {};
    const insert_or_add = (key: string) => {
        record[key] ? (record[key] += 1) : (record[key] = 1);
    };

    segments.forEach((segment) => {
        const points = use_diagonals
            ? segment.all_points
            : segment.linear_points;
        points.forEach((point) => {
            insert_or_add(point.to_string());
        });
    });

    const overlaps = Object.values(record).filter((count) => count >= 2).length;

    console.log("Overlaps:", overlaps);
}

const input = get_input(0);
const segments = input.map(Segment.New);

solve(segments, false); // part1
solve(segments, true); // part2
