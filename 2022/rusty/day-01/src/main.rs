use rusty::Part;

fn get_input() -> String {
    std::fs::read_to_string("input.txt")
        .expect("No input file!")
        .trim()
        .to_string()
}

#[allow(dead_code)]
const TEST_INPUT: &str = r#"1000
2000
3000

4000

5000
6000

7000
8000
9000

10000"#;

const IS_TEST_INPUT: bool = false;

fn main() {
    let input = if IS_TEST_INPUT {
        TEST_INPUT.to_string()
    } else {
        get_input()
    };

    let mut totals = input
        .split("\n\n")
        .map(|group| group.split("\n").collect::<Vec<_>>())
        .map(|lines| {
            lines
                .iter()
                .map(|line| line.parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .map(|group| group.iter().fold(0, |acc, x| acc + x))
        .collect::<Vec<_>>();

    let part = Part::One;
    match part {
        Part::One => part_1(&totals),
        Part::Two => part_2(&mut totals),
    }
}

fn part_1(totals: &[i32]) {
    let mut highest_total = 0;

    for total in totals.iter() {
        if highest_total < *total {
            highest_total = *total;
        }
    }

    println!("Highest total: {highest_total}");
}

fn part_2(totals: &mut [i32]) {
    totals.sort_by(|a, b| b.cmp(a));
    let top_three_sum = totals.iter().take(3).fold(0, |acc, x| acc + x);
    println!("Top three sum: {top_three_sum}");
}
