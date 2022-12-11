use std::collections::HashSet;

use rusty::*;

fn main() {
    let input = InputBuilder::new(InputMode::Real)
        .split_lines()
        .iter()
        .map(|line| -> Vec<_> { line.chars().map(|ch| ch.priority()).collect() })
        .collect::<Vec<_>>();

    part_1(&input);
    part_2(&input);
}

fn part_1(input: &[Vec<u8>]) {
    let total = input
        .iter()
        .map(|line| -> u16 {
            let (left, right) = line.split_at(line.len() / 2);
            let common = left
                .iter()
                .find(|it| right.contains(it))
                .expect("No common item found");
            *common as u16
        })
        .fold(0 as u16, |acc, x| acc + x);

    println!("Part 1: {}", total);
}

fn part_2(input: &[Vec<u8>]) {
    let total = input.chunks(3).fold(0 as u16, |acc, chunk| {
        if let [a, b, c] = chunk {
            let common = a
                .iter()
                .find(|it| b.contains(it) && c.contains(it))
                .expect("No common item found");
            return acc + *common as u16;
        } else {
            panic!("Invalid slice shape")
        }
    });

    println!("Part 2: {}", total);
}

trait CharExtension {
    fn priority(&self) -> u8;
}

impl CharExtension for char {
    fn priority(&self) -> u8 {
        if self.is_lowercase() {
            (*self as u8) - b'a' + 1
        } else {
            (*self as u8) - b'A' + 27
        }
    }
}
