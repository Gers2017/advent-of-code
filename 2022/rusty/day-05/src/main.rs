use rusty::*;
use std::collections::HashMap;
type Column = HashMap<usize, Vec<u8>>;

fn main() {
    let (stack_lines, proc_lines) = match InputBuilder::new(InputMode::Real)
        .split_double_lines()
        .as_slice()
    {
        [a, b] => (
            a.lines().map(|it| it.to_string()).collect::<Vec<_>>(),
            b.trim_end()
                .lines()
                .map(|it| it.to_string())
                .collect::<Vec<_>>(),
        ),
        _ => {
            eprintln!("Invalid input");
            return;
        }
    };

    let part = Part::Two;

    let mut columns: Column = stack_lines
        .iter()
        .rev()
        .skip(1) // skip line with numbers
        .flat_map(|line| line_to_crates(line))
        .fold(
            HashMap::<usize, Vec<u8>>::new(),
            |mut columns, (i, crate_u8)| {
                if let Some(value) = columns.get_mut(&i) {
                    value.push(crate_u8);
                } else {
                    let mut stack = Vec::new();
                    stack.push(crate_u8.to_owned());
                    columns.insert(i, stack);
                }

                columns
            },
        );

    let procedures = get_procedures(&proc_lines);
    for proc in procedures.iter() {
        let Procedure { amount, from, to } = proc;
        let mut crates: Vec<u8> = (0..(*amount as usize))
            .map(|_| {
                columns
                    .get_mut(from)
                    .expect("Invalid key")
                    .pop()
                    .expect("Empty vector")
            })
            .collect();

        if part == Part::Two {
            crates.reverse();
        }

        for c in crates {
            columns.get_mut(to).expect("Invalid [to] key").push(c);
        }
    }

    let mut keys = columns.keys().collect::<Vec<_>>();
    keys.sort();

    let message: String = keys
        .iter()
        .map(|i| columns.get(i).unwrap())
        .map(|stack| stack.last().expect("Empty vector").clone())
        .map(|it| it as char)
        .collect();

    println!("Message: {}", &message);
}

#[allow(dead_code)]
fn print_columns(columns: &Column) {
    for (i, v) in columns.iter() {
        println!("{i} -> {:?}", &v);
    }
}

fn line_to_crates(line: &str) -> Vec<(usize, u8)> {
    let mut crates: Vec<Option<u8>> = vec![];
    for i in (0..line.len() + 1).step_by(4) {
        let end = (i + 3).min(line.len());
        let slice = line.chars().skip(i).take(end - i).collect::<Vec<_>>();
        let s: String = slice.iter().collect();

        if s.trim().is_empty() {
            crates.push(None);
        } else {
            // Push a single char
            for ch in s.chars().filter(|ch| ch.is_alphabetic()) {
                crates.push(Some(ch as u8));
                break;
            }
        }
    }

    crates
        .iter()
        .enumerate()
        .filter(|(_, c)| c.is_some())
        .map(|(i, c)| (i, c.unwrap()))
        .collect()
}

struct Procedure {
    amount: u32,
    from: usize,
    to: usize,
}

impl Procedure {
    fn new(amount: u32, from: usize, to: usize) -> Self {
        Procedure { amount, from, to }
    }
}

fn get_procedures(proc_lines: &[String]) -> Vec<Procedure> {
    proc_lines
        .iter()
        .map(|proc| {
            let proc_rp = proc
                .replace("move ", "")
                .replace("from ", "")
                .replace("to", "")
                .trim()
                .to_string();

            let values = proc_rp
                .split_whitespace()
                .map(|x| {
                    x.parse::<u32>()
                        .expect(format!("Invalid value to parse {}", &x).as_str())
                })
                .collect::<Vec<_>>();

            match values.as_slice() {
                [amount, from, to] => {
                    // Decrease by one to use indices
                    Procedure::new(*amount, (*from - 1) as usize, (*to - 1) as usize)
                }
                _ => panic!(
                    "Error at parsing procedure: {} | {:?}",
                    &proc,
                    &values.clone()
                ),
            }
        })
        .collect()
}
