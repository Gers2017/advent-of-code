import { get_input } from "../utils/helpers.ts";

interface Segment {
    from: Point;
    to: Point;
}

interface Point {
    x: number;
    y: number;
}

const new_segment = (from: Point, to: Point) => ({ from, to });
const new_point = (x: number, y: number) => ({ x, y });
const equals_point = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
const in_same_axis = (a: Point, b: Point) => a.x === b.x || a.y === b.y;

function direction_to(a: Point, b: Point): Point {
    const diff = new_point(b.x - a.x, b.y - a.y);
    const magnitude = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
    return new_point(
        Math.round(diff.x / magnitude),
        Math.round(diff.y / magnitude)
    );
}

function on_segment_points(
    segment: Segment,
    on_point: (point: Point) => void,
    only_linear?: boolean
) {
    const { from, to } = segment;
    if (only_linear && !in_same_axis(from, to)) {
        return;
    }
    const step = direction_to(from, to);
    const point = new_point(from.x, from.y);
    on_point(point);

    while (!equals_point(point, to)) {
        point.x += step.x;
        point.y += step.y;
        on_point(point);
    }
}

function solve(segments: Segment[], only_linear?: boolean) {
    const record: Record<string, number> = {};
    const insert_or_add = (key: string) => {
        record[key] ? (record[key] += 1) : (record[key] = 1);
    };
    segments.forEach((s) => {
        on_segment_points(
            s,
            (point) => insert_or_add(`${point.x},${point.y}`),
            only_linear
        );
    });

    const overlaps = Object.values(record).filter((n) => n >= 2).length;
    console.log(overlaps);
}
const segments = get_input(0).map((line) => {
    const regex = /^(\d+),(\d+) -> (\d+),(\d+)$/gim;
    const match = regex.exec(line)!;
    const [_, x1, y1, x2, y2] = match.map(Number);
    return new_segment(new_point(x1, y1), new_point(x2, y2));
});

solve(segments, true);
