import {
    find_transform_if_intersects,
    get_highest_distance,
    Scanner,
    ScannerSet,
    Vector3,
} from "./lib.ts";
import Queue from "./queue.ts";

export function solution_v3(scanners: Scanner[], log = false) {
    main(scanners, log);
}

function main(scanners: Scanner[], log = false) {
    const scanner_0 = new ScannerSet(
        0,
        scanners.splice(0, 1)[0],
        Vector3.zero()
    );

    const scanner_sets = scanners.map(
        (s, i) => new ScannerSet(i + 1, s, Vector3.zero())
    );

    const closed: ScannerSet[] = [];
    const closed_ids = new Set<number>();
    const id_in_closed = (id: number) => closed_ids.has(id);

    const open = new Queue<ScannerSet>();
    open.enqueue(scanner_0);

    console.time("day-19-v3");

    while (open.length > 0) {
        // evaluating, remove from open
        const evaluating = open.dequeue()!;

        const others = scanner_sets.filter(
            (it) => !id_in_closed(it.id) && it.id !== evaluating.id
        );
        // get all items that are not evaluating and not in closed
        for (const right of others) {
            log && console.log("scanning", evaluating.id, "vs", right.id);

            const transform = find_transform_if_intersects(
                evaluating.scanner,
                right.scanner
            );

            if (transform) {
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

        closed.push(evaluating);
        closed_ids.add(evaluating.id);
        log && console.log("closed", closed_ids);
        log && console.log("---".repeat(12));
    }

    console.timeEnd("day-19-v3");

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
