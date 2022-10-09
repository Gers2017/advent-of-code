import { InputMode } from "../utils/helpers.ts";
import {
    get_moved_scanners,
    Scanner,
    Vector3,
    Register,
    get_transform_from_moved_scanners,
    find_transform_if_intersects,
    get_highest_manhattan_distance,
    get_scanner_input,
} from "./lib.ts";

import { solve_recursive } from "./recursive.ts";
import { solution_v3 } from "./sol_v3.ts";

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
            base_scanner.register_all_points(transform.points);
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
    // like a queue
    const other_scanners = scanners.slice(1);
    const found_scanners = [Vector3.New(0, 0, 0)];

    while (other_scanners.length > 0) {
        // like a pop from queue (beacons)
        const right_scanner = other_scanners.splice(0, 1)[0];

        const transform = find_transform_if_intersects(
            base_scanner.points,
            right_scanner
        );

        if (transform) {
            // append all beacons to the base scanner
            base_scanner.register_all_points(transform.points);
            // append new scanner position
            found_scanners.push(transform.scanner_pos);
        } else {
            // if not found, enqueue popped scanner
            other_scanners.push(right_scanner);
        }
    }

    console.timeEnd("day-19-v2");
    console.log("---".repeat(12));
    console.log("scanners:", found_scanners.length);
    console.log("beacons:", base_scanner.points.length);

    get_highest_manhattan_distance(found_scanners);
}

enum Solution {
    V1,
    V2,
    V3,
    Recursive,
}

function main(solution: Solution, mode: InputMode) {
    const scanners = get_scanner_input(mode);

    switch (solution) {
        case Solution.V1:
            solution_v1(scanners);
            break;
        case Solution.V2:
            solution_v2(scanners);
            break;
        case Solution.V3:
            solution_v3(scanners);
            break;
        case Solution.Recursive:
            solve_recursive(scanners);
            break;
    }
}

main(Solution.Recursive, InputMode.Real);
