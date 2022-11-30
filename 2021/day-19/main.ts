import { InputMode } from "../utils/helpers.ts";
import {
    get_scanners,
    get_highest_distance,
    find_transform_if_intersects,
    Scanner,
    ScannerSet,
    Vector3,
} from "./lib.ts";
import Queue from "../utils/queue.ts";

function main(mode: InputMode, log = false) {
    const scanners = get_scanners(mode);
    solve(scanners, log);
}

function solve(scanners: Scanner[], log = false) {
    const first_set = new ScannerSet(0, scanners[0], Vector3.zero());
    const scanner_sets = scanners
        .filter((_, i) => i !== 0)
        .map((s, i) => new ScannerSet(i + 1, s, Vector3.zero()));

    const closed: ScannerSet[] = [];
    const closed_ids = new Set<number>();
    const open = new Queue<ScannerSet>();
    open.enqueue(first_set);

    console.time("day-19-scanner-set");
    while (open.length > 0) {
        // current, remove from open
        const current = open.dequeue()!;

        const others = scanner_sets.filter(
            (it) => it.id !== current.id && !closed_ids.has(it.id)
        );
        // get all items that are not current and not in closed
        for (const right of others) {
            log && console.log("scanning", current.id, "vs", right.id);

            const transform = find_transform_if_intersects(
                current.scanner,
                right.scanner
            );

            if (transform) {
                log && console.log("scanning", current.id, "vs", right.id);
                log && console.log("new scanner at:", transform.scanner_pos);

                // open.push(
                open.enqueue(
                    new ScannerSet(
                        right.id,
                        transform.points,
                        transform.scanner_pos
                    )
                );

                log && console.log("-> pushing", right.id, "to open set");
            }
        }

        if (!closed_ids.has(current.id)) {
            closed_ids.add(current.id);
            closed.push(current);
            log && console.log("closed", closed_ids);
        }
        log && console.log("---".repeat(12));
    }

    console.timeEnd("day-19-scanner-set");

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
    const scanner_positions = closed.map((it) => it.position);
    console.log("scanners:", scanner_positions.length);
    console.log("beacons:", beacons.length);

    console.time("manhattan distance");
    const { a, b, highest } = get_highest_distance(scanner_positions);
    console.log("Highest distance:", highest);
    console.log(`From (${a.to_string()}) to (${b.to_string()})`);
    console.timeEnd("manhattan distance");
}

main(InputMode.Real);
