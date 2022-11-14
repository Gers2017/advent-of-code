use day_19::*;
use rust_days::{get_input_raw, InputMode};
use std::{
    collections::{HashSet, VecDeque},
    time::Instant,
};

fn main() {
    let input = get_input_raw(InputMode::Real).expect("No input file");
    let mut scanners = get_input_as_scanners(input);

    let first_set = ScannerSet::new(0, Vector3::zero());
    let scanner_sets: Vec<ScannerSet> = (1..scanners.len())
        .map(|i| ScannerSet::new(i, Vector3::zero()))
        .collect();

    let mut open: VecDeque<ScannerSet> = VecDeque::new();
    open.push_back(first_set);

    let mut closed_ids: HashSet<usize> = HashSet::new();
    let mut closed_sets: Vec<ScannerSet> = Vec::new();

    let now = Instant::now();

    while !open.is_empty() {
        let current = open.pop_front().expect("Cannot pop empty set!");
        let to_scan: Vec<&ScannerSet> = scanner_sets
            .iter()
            .filter(|set| set.id != current.id && !closed_ids.contains(&set.id))
            .collect();

        for right in to_scan.iter() {
            let current_scanner = scanners[current.id].as_ref();
            let right_scanner = scanners[right.id].as_ref();

            let transform = find_transform(current_scanner, right_scanner);

            if let Some(transform) = transform {
                // Take Ownership of points
                scanners[right.id] = transform.points;
                open.push_back(ScannerSet::new(right.id, transform.scanner_position));
            }
        }

        closed_ids.insert(current.id);
        closed_sets.push(current);
    }

    let elapsed = now.elapsed();
    println!(
        "Elapsed: {}ms | {}s",
        elapsed.as_millis(),
        elapsed.as_secs()
    );

    let positions = closed_sets.iter().map(|s| s.position).collect::<Vec<_>>();
    println!("scanners positions: {}", positions.len());

    let mut beacons = HashSet::new();

    for set in closed_sets.iter() {
        for point in scanners[set.id].iter() {
            beacons.insert(point);
        }
    }

    println!("Beacons: {}", beacons.len());

    // Max Manhattan Distance of scanners
    let result = get_highest_distance(&positions);

    println!(
        "Max Manhattan distance of scanners: {}\nfrom: {}, to: {}",
        result.distance, result.a, result.b
    );
}
