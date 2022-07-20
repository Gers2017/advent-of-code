use day_19_rs::*;
use std::{collections::HashSet, fs, time::Instant};

fn main() {
    let input = get_input(InputMode::Test);
    let scanners: Vec<Scanner> = input
        .split("\n\n")
        .map(|text| {
            let lines = text.split("\n").collect::<Vec<_>>();
            Scanner::from_lines(&lines)
        })
        .collect();

    let now = Instant::now();

    let scanner_0: Scanner = scanners.get(0).unwrap().clone();
    let mut closed: Vec<Scanner> = vec![];
    let mut closed_ids: HashSet<String> = HashSet::new();
    let mut open: Vec<Scanner> = vec![scanner_0];

    while open.len() > 0 {
        // evaluating scanner, remove from open
        let evaluating = open.remove(0);
        // println!("<- evaluating: {} ->", &evaluating.id);

        // get all the scanners that are not equal to evaluating and not in closed
        let others: Vec<&Scanner> = scanners
            .iter()
            .filter(|it| it.id != evaluating.id && !closed_ids.contains(&it.id))
            .collect();

        // let debug_to_scan: Vec<String> = others.iter().map(|x| x.id.to_string()).collect();
        // println!("{:#?}", &debug_to_scan);

        for right in others.iter() {
            if let Some(t) = find_transform_if_intersects(&evaluating.points, &right.points) {
                // println!("found transform {}", &t);
                let id = right.id.to_owned();
                let Transform {
                    scanner_position,
                    points,
                } = t;

                open.push(Scanner::new(id, points, Some(scanner_position)));
            }
        }

        closed_ids.insert(evaluating.id.clone());
        closed.push(evaluating);
        // println!("{}", "---".repeat(12));
    }

    let elapsed = now.elapsed();
    println!("Elapsed: {:.2?}", elapsed);

    let scanner_positions: Points = closed.iter().map(|it| it.position).collect();
    println!("scanners: {}", scanner_positions.len());

    let mut beacons: HashSet<Vector3> = HashSet::new();
    for scanner in closed.iter() {
        for point in scanner.points.iter() {
            beacons.insert(*point);
        }
    }

    println!("beacons: {}", beacons.len());

    get_highest_manhattan_distance(&scanner_positions);
}

enum InputMode {
    #[allow(dead_code)]
    Real,
    #[allow(dead_code)]
    Test,
}

fn get_input(mode: InputMode) -> String {
    let filename = match mode {
        InputMode::Real => "input.txt",
        InputMode::Test => "input_test.txt",
    };

    fs::read_to_string(&filename).unwrap()
}

fn find_transform_if_intersects(left: &Points, right: &Points) -> Option<Transform> {
    for face in 0..6 {
        for rotate in 0..4 {
            let right_reoriented: Points = right
                .iter()
                .map(|it| it.face(face).rotate(rotate))
                .collect();

            for a in left.iter() {
                for b in right_reoriented.iter() {
                    let difference = a.minus(b);
                    let moved: Points = right_reoriented
                        .iter()
                        .map(|it| it.plus(&difference))
                        .collect();

                    let count = intersection_count(&moved, &left);

                    if count >= 12 {
                        return Some(Transform::new(difference, moved));
                    }
                }
            }
        }
    }

    None
}

#[allow(dead_code)]
fn intersection_count(ls: &Points, ls2: &Points) -> usize {
    let mut count = 0 as usize;
    for a in ls.iter() {
        if ls2.contains(a) {
            count += 1;
        }
    }
    count
}

fn get_highest_manhattan_distance(_points: &Points) {
    let points = _points.clone();
    let mut highest = 0;
    let mut data: (Vector3, Vector3) = (Vector3::zero(), Vector3::zero());
    let mut checked: HashSet<Vector3> = HashSet::new();

    for a in points.iter() {
        let to_check: Points = points
            .iter()
            .filter(|it| !it.equals(a) && !checked.contains(it))
            .map(|it| *it)
            .collect();

        for b in to_check.iter() {
            let distance = a.manhattan_distance(b);
            if distance > highest {
                highest = distance;
                data = (a.clone(), b.clone());
            }
        }

        checked.insert(*a);
    }

    println!("From points: {} to {}", data.0, data.1);
    println!("Highest distance: {}", highest);
}
