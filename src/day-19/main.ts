import { get_input_raw, InputMode } from "../utils/helpers.ts";
import {
    scanner_from_lines,
    new_transform,
    get_moved_scanners,
    Scanner,
    Vector3,
    intersect,
    Register,
} from "./lib.ts";

import { range } from "../utils/extensions.ts";

function solution_v1(scanners: Scanner[]) {
    console.time("day-19-v1");

    const base_scanner = new Register(scanners[0]);
    const other_scanners = scanners.slice(1);
    // get moved scanners
    const list_of_moved_scanners = other_scanners.map((scanner) =>
        get_moved_scanners(scanner)
    );

    // start search
    // compare base scanner with the moved scanners, searching for >= 12 equal points
    const found_scanners = [Vector3.New(0, 0, 0)];
    while (list_of_moved_scanners.length > 0) {
        const moved_scanners = list_of_moved_scanners.splice(0, 1)[0];
        const transform = get_transform_from_moved_scanners(
            base_scanner,
            moved_scanners
        );
        // if there's a transform, save the scanner_pos and the points
        // remove moved_scanners from list_of_moved_scanners
        if (transform) {
            base_scanner.add_all_points(transform.points);
            found_scanners.push(transform.scanner_pos);
        } else {
            list_of_moved_scanners.push(moved_scanners);
        }
    }

    console.timeEnd("day-19-v1");
    console.log("---".repeat(12));
    console.log("scanners:", found_scanners.length);
    console.log("beacons:", base_scanner.points.length);

    get_highest_manhattan_distance(found_scanners);
}

function solution_v2(scanners: Scanner[]) {
    console.time("day-19-v2");

    const base_scanner = new Register(scanners[0]);
    const other_scanners = scanners.slice(1);
    const found_scanners = [Vector3.New(0, 0, 0)];

    while (other_scanners.length > 0) {
        const right_scanner = other_scanners.splice(0, 1)[0];

        const transform = find_transform_if_intersects(
            base_scanner.points,
            right_scanner
        );

        if (transform) {
            base_scanner.add_all_points(transform.points);
            found_scanners.push(transform.scanner_pos);
        } else {
            other_scanners.push(right_scanner);
        }
    }

    console.timeEnd("day-19-v2");
    console.log("---".repeat(12));
    console.log("scanners:", found_scanners.length);
    console.log("beacons:", base_scanner.points.length);

    get_highest_manhattan_distance(found_scanners);
}

function get_transform_from_moved_scanners(
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

function get_transform_overlap(base_scanner: Scanner, right_scanner: Scanner) {
    for (const s1 of base_scanner) {
        for (const s2 of right_scanner) {
            const diff = s1.minus(s2);
            const translated = right_scanner.map((x) => x.plus(diff));
            const intersection = intersect(translated, base_scanner);
            if (intersection.length >= 12) {
                return new_transform(diff, translated);
            }
        }
    }

    return null;
}

function find_transform_if_intersects(left: Scanner, right: Scanner) {
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

function get_highest_manhattan_distance(scanner_points: Vector3[]) {
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

enum Solution {
    V1,
    V2,
}

function main(solution: Solution) {
    const scanners = get_input_raw(InputMode.Real)
        .split("\n\n")
        .map((text) => text.split("\n"))
        .map((lines) => scanner_from_lines(lines));

    switch (solution) {
        case Solution.V1:
            solution_v1(scanners);
            break;
        case Solution.V2:
            solution_v2(scanners);
            break;
    }
}

main(Solution.V1);
