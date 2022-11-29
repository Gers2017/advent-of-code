import {
    ScannerSet,
    Scanner,
    Vector3,
    Memory,
    find_transform,
    get_highest_distance,
} from "./lib.ts";
import Queue from "./queue.ts";

export function solve_recursive(scanners: Scanner[]) {
    const memory = new Map<string, Vector3>();
    const pool = scanners.map((s, i) => new ScannerSet(i, s, Vector3.zero()));
    const closed: ScannerSet[] = [];
    const open = new Queue<ScannerSet>();
    open.enqueue(pool[0]);

    console.time("recursive");
    iterate(open, pool, [], closed, memory);
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
    get_highest_distance(beacons);
    console.timeEnd("manhattan distance");
}

function iterate(
    open: Queue<ScannerSet>,
    pool: ScannerSet[],
    ignore_indices: number[],
    closed: ScannerSet[],
    memory: Memory
) {
    // stop recursion
    if (open.length === 0) return;

    // pop from Queue -> value
    const s = open.dequeue()!;

    // slice or filter array
    for (let i = 0; i < pool.length; i++) {
        if (i === s.id || ignore_indices.includes(i)) continue;

        const other = pool[i];
        const t = find_transform(s.scanner, other.scanner);

        if (t) {
            const { points, scanner_pos } = t;
            open.enqueue(new ScannerSet(other.id, points, scanner_pos));
        }
    }

    // register value as seen
    ignore_indices.push(s.id);
    closed.push(s);
    iterate(open, pool, ignore_indices, closed, memory);
}
