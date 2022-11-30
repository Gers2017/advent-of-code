import {
    get_scanners,
    ScannerSet,
    Vector3,
    find_transform_if_intersects,
    get_highest_distance_recursive,
} from "./lib.ts";
import { InputMode } from "../utils/helpers.ts";
import Queue from "../utils/queue.ts";

export function solve_recursive(mode: InputMode) {
    const scanners = get_scanners(mode);
    const pool = scanners.map((s, i) => new ScannerSet(i, s, Vector3.zero()));
    const closed: ScannerSet[] = [];
    const ignore_indices = new Set<number>();

    const open = new Queue<ScannerSet>();
    open.enqueue(pool[0]);

    console.time("recursive");
    iterate(open, pool, ignore_indices, closed);
    console.timeEnd("recursive");

    const scanner_positions = closed.map((it) => it.position);

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

    console.log("scanners:", scanner_positions.length);
    console.log("beacons:", beacons.length);

    console.time("manhattan distance");
    const { a, b, highest } = get_highest_distance_recursive(scanner_positions);
    console.log("Highest distance:", highest);
    console.log(`From (${a.to_string()}) to (${b.to_string()})`);
    console.timeEnd("manhattan distance");
}

function iterate(
    open: Queue<ScannerSet>,
    pool: ScannerSet[],
    ignore_indices: Set<number>,
    closed: ScannerSet[]
) {
    // stop recursion
    if (open.length === 0) return;

    // pop from Queue -> value
    const s = open.dequeue()!;

    // slice or filter array
    for (let i = 0; i < pool.length; i++) {
        if (i === s.id || ignore_indices.has(i)) continue;

        const other = pool[i];
        const t = find_transform_if_intersects(s.scanner, other.scanner);

        if (t) {
            const { points, scanner_pos } = t;
            open.enqueue(new ScannerSet(other.id, points, scanner_pos));
        }
    }

    // register value as seen
    if (!ignore_indices.has(s.id)) {
        ignore_indices.add(s.id);
        closed.push(s);
    }

    iterate(open, pool, ignore_indices, closed);
}

solve_recursive(InputMode.Real);
