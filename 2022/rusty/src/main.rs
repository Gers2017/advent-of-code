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

fn main() {
    let c_groups = get_input()
        .split("\n\n")
        .map(|text_set| text_set.split("\n").collect::<Vec<_>>())
        .map(|lines| {
            lines
                .iter()
                .map(|line| line.parse::<i32>().unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    let is_part2 = true;

    if is_part2 {
        part_2(&c_groups);
    } else {
        part_1(&c_groups);
    }
}

fn part_1(c_groups: &[Vec<i32>]) {
    let mut highest_sum = 0;
    for group in c_groups.iter() {
        let sum = group.iter().fold(0, |acc, x| x + acc);
        if highest_sum < sum {
            highest_sum = sum;
        }
    }

    println!("result: {highest_sum}");
}

fn part_2(c_groups: &[Vec<i32>]) {
    let mut sum_groups = c_groups
        .iter()
        .map(|group| group.iter().fold(0, |acc, x| acc + x))
        .collect::<Vec<_>>();

    sum_groups.sort();
    sum_groups.reverse();

    let result = sum_groups[0] + sum_groups[1] + sum_groups[2];
    println!("{} {} {}", sum_groups[0], sum_groups[1], sum_groups[2]);
    println!("result: {result}");
}
