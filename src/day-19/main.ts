import { get_input_raw, InputMode } from "../utils/helpers.ts";
import {
    scanner_from_lines,
    get_moved_scanners,
    Scanner,
    Vector3,
    Register,
    get_transform_from_moved_scanners,
    find_transform_if_intersects,
    ScannerSet,
} from "./lib.ts";

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

function solution_v3(scanners: Scanner[], log = false) {
    const scanner_0 = new ScannerSet("scanner-0", scanners.splice(0, 1)[0]);
    const scanner_sets = scanners.map(
        (s, i) => new ScannerSet(`scanner-${i + 1}`, s)
    );

    console.time("day-19-v3");
    const closed: ScannerSet[] = [];
    const closed_ids = new Set<string>();
    const id_in_closed = (id: string) => closed_ids.has(id);
    const open = [scanner_0];

    while (open.length > 0) {
        // evaluating, remove from open
        const evaluating = open.shift()!;
        log && console.log({ evaluating: evaluating.id });

        const others = scanner_sets.filter(
            (it) => !id_in_closed(it.id) && it.id !== evaluating.id
        );
        // get all items that are not evaluating and not in closed
        for (const right of others) {
            const transform = find_transform_if_intersects(
                evaluating.scanner,
                right.scanner
            );

            if (transform) {
                open.push(
                    new ScannerSet(
                        right.id,
                        transform.points,
                        transform.scanner_pos
                    )
                );
                log && console.log("pushing", right.id, "to open set");
            }
        }

        closed.push(evaluating);
        closed_ids.add(evaluating.id);
        log && console.log("---".repeat(12));
    }

    console.timeEnd("day-19-v3");

    const scanner_positions = closed.map((it) => it.position);
    console.log("scanners:", scanner_positions.length);

    const seen_beacons = new Set<string>();
    const beacons = [];
    for (const scanner_set of closed) {
        for (const point of scanner_set.scanner) {
            if (!seen_beacons.has(point.to_string())) {
                beacons.push(point);
                seen_beacons.add(point.to_string());
            }
        }
    }

    console.log("beacons:", beacons.length);
    get_highest_manhattan_distance(scanner_positions);
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
    V3,
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
        case Solution.V3:
            solution_v3(scanners);
    }
}

main(Solution.V3);
