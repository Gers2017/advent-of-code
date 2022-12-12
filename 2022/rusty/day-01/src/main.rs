use rusty::*;

fn main() {
    let groups: Vec<_> = InputBuilder::new(InputMode::Real)
        .double_lines_iter()
        .map(|x| -> Vec<_> {
            x.lines()
                .map(|it| it.parse::<u32>().expect("Not a valid number"))
                .collect()
        })
        .collect();

    let mut totals = groups
        .iter()
        .map(|group| -> u32 { group.iter().sum() })
        .collect::<Vec<_>>();

    part_1(&totals);
    part_2(&mut totals);
}

fn part_1(totals: &[u32]) {
    let highest_total = totals.iter().max().unwrap().clone();
    println!("Highest total: {}", highest_total);
}

fn part_2(totals: &mut [u32]) {
    totals.sort_by(|a, b| b.cmp(a));
    let sum: u32 = totals.iter().take(3).sum();
    println!("Top three sum: {}", sum);
}
