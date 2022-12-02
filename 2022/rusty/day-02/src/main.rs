use rusty::{InputBuilder, InputMode, Part};

type StringTuple = (String, String);
type Guide<'a> = &'a [StringTuple];

fn main() {
    let guide = InputBuilder::new(InputMode::Real)
        .split_lines()
        .iter()
        .map(|line| line.split(" ").collect::<Vec<_>>())
        .map(|split| (split[0].to_string(), split[1].to_string()))
        .collect::<Vec<_>>();

    solve(&guide, Part::One);
    solve(&guide, Part::Two);
}

fn solve(guide: Guide<'_>, part: Part) {
    let total_score: usize = guide
        .iter()
        .map(|(a, b)| -> (Move, Move) {
            match part {
                Part::One => (get_move_by_str(a), get_move_by_str(b)),
                Part::Two => {
                    let opp_move = get_move_by_str(a);
                    let my_move = get_move_by_strategy(opp_move, b);
                    (opp_move, my_move)
                }
            }
        })
        .map(|(opp_move, my_move)| -> usize {
            get_move_score(my_move) + get_outcome_score(my_move, opp_move)
        })
        .sum();

    print!("{}: ", part);
    println!("Total score: {}", total_score);
}

#[derive(PartialEq, Eq, Clone, Copy, Debug)]
enum Move {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

impl std::fmt::Display for Move {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use Move::*;
        let name = match self {
            Rock => "Rock",
            Paper => "Paper",
            Scissors => "Scissors",
        };

        write!(f, "{}", name)
    }
}
/// Returns a Move using a string value.
/// Valid strings are: A,B,C and X,Y,Z for part 2
fn get_move_by_str(s: &str) -> Move {
    match s {
        "A" | "X" => Move::Rock,
        "B" | "Y" => Move::Paper,
        "C" | "Z" => Move::Scissors,
        _ => panic!("Invalid move {}", &s),
    }
}

fn get_loose_move(m: Move) -> Move {
    use Move::*;
    match m {
        Rock => Scissors,
        Paper => Rock,
        Scissors => Paper,
    }
}

fn get_win_move(m: Move) -> Move {
    use Move::*;
    match m {
        Rock => Paper,
        Paper => Scissors,
        Scissors => Rock,
    }
}

fn get_move_by_strategy(opp_move: Move, strategy: &str) -> Move {
    match strategy {
        "X" => get_loose_move(opp_move), // Loose
        "Y" => opp_move,                 // Draw
        "Z" => get_win_move(opp_move),   // Win
        _ => panic!("Invalid strategy \"{}\"!", &strategy),
    }
}

fn get_move_score(m: Move) -> usize {
    m as usize
}

fn get_outcome_score(pm: Move, om: Move) -> usize {
    return if get_loose_move(pm) == om {
        // Win
        6 as usize
    } else if get_loose_move(om) == pm {
        // Lost
        0 as usize
    } else {
        // Draw
        3 as usize
    };
}
