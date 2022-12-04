use rusty::*;

fn main() {
    let input = InputBuilder::new(InputMode::Real)
        .split_lines()
        .iter()
        .map(|line| map_to_set_u8(line))
        .collect::<Vec<_>>();

    part_1(&input);
    part_2(&input);
}

fn map_to_set_u8(line: &str) -> Vec<u8> {
    line.chars()
        .map(|ch| {
            if ch.is_lowercase() {
                (ch as u8) - b'a' + 1
            } else {
                (ch as u8) - b'A' + 27
            }
        })
        .collect()
}

fn part_1(input: &[Vec<u8>]) {
    let total = input
        .iter()
        .map(|line| {
            let (left, right) = line.split_at(line.len() / 2);
            left.iter()
                .filter(|x| right.contains(x))
                .next()
                .unwrap()
                .clone()
        })
        .fold(0 as u16, |acc, x| acc + x as u16);

    println!("Part 1: {}", total);
}

fn part_2(input: &[Vec<u8>]) {
    let mut groups = Vec::new();
    for (i, _) in input.iter().enumerate().step_by(3) {
        groups.push((input[i].clone(), input[i + 1].clone(), input[i + 2].clone()));
    }

    let total = groups
        .iter()
        .map(|group| -> u8 {
            let (g1, g2, g3) = group;
            g1.iter()
                .filter(|x| g2.contains(x) && g3.contains(x))
                .next()
                .unwrap()
                .clone()
        })
        .fold(0 as u16, |acc, x| acc + x as u16);
    println!("Part 2: {}", total);
}
