use rusty::*;
use std::collections::{HashSet, VecDeque};

fn main() {
    let stream = InputBuilder::new(InputMode::Real).raw();
    solve(&stream, Part::Two);
}

fn solve(stream: &str, part: Part) {
    let mut window: VecDeque<char> = VecDeque::new();
    let chunk_size = if part == Part::One { 4 } else { 14 };
    let mut index = -1;

    for (i, ch) in stream.chars().enumerate() {
        window.push_back(ch);

        if window.len() > chunk_size {
            window.pop_front();
        }

        if window.len() == chunk_size {
            let unique: HashSet<&char> = HashSet::from_iter(window.iter());
            if unique.len() == window.len() {
                index = (i + 1) as i32;
                break;
            }
        }
    }

    println!("{} Characters: {}", part, index);
}
