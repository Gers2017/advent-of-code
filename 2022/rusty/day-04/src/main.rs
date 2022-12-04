use day_04::Range;
use rusty::*;

fn main() {
    let input = InputBuilder::new(InputMode::Real)
        .split_lines()
        .iter()
        .map(|line| line_to_range(line.as_str()))
        .collect::<Vec<_>>();

    // part 1, full overlap
    let full_overlap_count = input
        .iter()
        .filter(|(a, b)| a.overlaps(b) || b.overlaps(a))
        .count();

    println!("Part 1: {}", full_overlap_count);

    // part 2, partial overlap
    let partial_overlap_count = input
        .iter()
        .filter(|(a, b)| a.partially_overlaps(b) || b.partially_overlaps(a))
        .count();

    println!("Part 2: {}", partial_overlap_count);
}

fn line_to_range(s: &str) -> (Range, Range) {
    let ranges = s
        .split(",")
        .map(|slice| {
            let numbers = slice
                .split("-")
                .map(|num| num.parse::<u32>().unwrap())
                .collect::<Vec<_>>();
            if let [a, b] = numbers.as_slice() {
                Range { start: *a, end: *b }
            } else {
                panic!("Invalid input at slice: {slice}")
            }
        })
        .collect::<Vec<_>>();

    if let [a_range, b_range] = ranges.as_slice() {
        (*a_range, *b_range)
    } else {
        panic!("Invalid input at range: {:?}", ranges)
    }
}
