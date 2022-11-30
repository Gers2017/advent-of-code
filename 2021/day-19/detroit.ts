import Queue from "../utils/queue.ts";
import { InputMode } from "../utils/helpers.ts";
import {
    get_scanners,
    ScannerRef,
    Vector3,
    find_transform_if_intersects,
    get_highest_distance,
} from "./lib.ts";

const scanners = get_scanners(InputMode.Real);
const first_ref = new ScannerRef(0, Vector3.zero());
const scanner_refs = [];
for (let i = 1; i < scanners.length; i++) {
    scanner_refs.push(new ScannerRef(i, Vector3.zero()));
}

const open = new Queue<ScannerRef>();
open.enqueue(first_ref);

const closed_ids = new Set<number>();
const closed: ScannerRef[] = [];

console.time("day-19-scanner-ref");

while (!open.is_empty()) {
    const current = open.dequeue()!;
    for (const right_ref of scanner_refs) {
        if (right_ref.id == current.id || closed_ids.has(right_ref.id))
            continue;

        const left_scanner = scanners[current.id];
        const right_scanner = scanners[right_ref.id];

        const transform = find_transform_if_intersects(
            left_scanner,
            right_scanner
        );
        if (transform) {
            // console.log("-> scanners", right_ref.id);
            scanners[right_ref.id] = transform.points;
            open.enqueue(new ScannerRef(right_ref.id, transform.scanner_pos));
        }
    }

    closed_ids.add(current.id);
    closed.push(current);
    // console.log("Seen:", current.id, closed_ids);
}

console.timeEnd("day-19-scanner-ref");

// scanners
console.log("scanners:", scanners.length);
const scanner_positions = closed.map((it) => it.position);

// beacons
const seen_points = new Set<string>();
const beacons = [];

for (const scanner of scanners) {
    for (const point of scanner) {
        if (!seen_points.has(point.to_string())) {
            beacons.push(point);
            seen_points.add(point.to_string());
        }
    }
}

console.log("beacons:", beacons.length);

console.time("manhattan distance");
const { a, b, highest } = get_highest_distance(scanner_positions);
console.log("Highest distance:", highest);
console.log(`From (${a.to_string()}) to (${b.to_string()})`);
console.timeEnd("manhattan distance");
