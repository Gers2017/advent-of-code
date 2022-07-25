use std::cmp::Eq;
use std::collections::HashMap;
use std::fs;
use std::ops::Add;

#[allow(dead_code)]
enum InputType {
    Real,
    Test,
}

fn get_input(input_type: InputType) -> (u64, u64) {
    use InputType::*;
    let file = match input_type {
        Real => "input.txt",
        Test => "input_test.txt",
    };

    let text = fs::read_to_string(file).expect("Couldn't get input!");
    let positions: Vec<u64> = text
        .split("\n")
        .map(|line| -> u64 {
            let n = line
                .split(" ")
                .last()
                .map(|x| x.parse::<u64>())
                .unwrap()
                .expect("Last should be a number!");
            return n;
        })
        .collect();

    return (positions[0], positions[1]);
}

type GameWinRecord = HashMap<Game, WinCounter>;
type QuatumFrequency = HashMap<usize, u64>;

fn main() {
    let (p1_pos, p2_pos) = get_input(InputType::Real);
    solve_1(p1_pos, p2_pos);
    solve_2(p1_pos, p2_pos);
}

fn solve_1(p1_pos: u64, p2_pos: u64) {
    let win_score: u64 = 1000;
    let mut game = Game::initiate(p1_pos, p2_pos, win_score);
    let mut die = DeterministicDie::new();

    println!("p1:{} p2:{}", p1_pos, p2_pos);

    while !game.is_winner() {
        game = game.next(die.roll());
    }

    let total = game.get_min_player_score() * die.rolls;
    println!(
        "rolls: {}, min score: {} and total is: {total}",
        die.rolls,
        game.get_min_player_score()
    );
}

fn solve_2(p1_pos: u64, p2_pos: u64) {
    let mut game_record: GameWinRecord = HashMap::new();
    let quantum_die_frequency: QuatumFrequency =
        HashMap::from([(3, 1), (4, 3), (5, 6), (6, 7), (7, 6), (8, 3), (9, 1)]);
    let game = Game::initiate(p1_pos, p2_pos, 21);
    let wc = play_quantum_dice(game, &mut game_record, &quantum_die_frequency);
    println!("{}", wc.max());
}

#[derive(Eq, PartialEq, Hash)]
struct Game {
    is_player1_turn: bool,
    win_score: u64,
    player1: Player,
    player2: Player,
}

impl Game {
    fn initiate(player1_position: u64, player2_position: u64, win_score: u64) -> Self {
        Game::new(
            true,
            win_score,
            Player::new(player1_position, None),
            Player::new(player2_position, None),
        )
    }

    fn new(is_player1_turn: bool, win_score: u64, player1: Player, player2: Player) -> Self {
        Game {
            is_player1_turn,
            win_score,
            player1,
            player2,
        }
    }

    fn next(&self, die: u64) -> Game {
        let (player1, player2) = match self.is_player1_turn {
            true => (self.player1.next(die), self.player2),
            false => (self.player1, self.player2.next(die)),
        };

        Game::new(!self.is_player1_turn, self.win_score, player1, player2)
    }

    fn is_winner(&self) -> bool {
        self.player1.score >= self.win_score || self.player2.score >= self.win_score
    }

    fn get_min_player_score(&self) -> u64 {
        self.player1.score.min(self.player2.score)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Player {
    position: u64,
    score: u64,
}

impl Player {
    fn new(position: u64, score: Option<u64>) -> Self {
        Player {
            position,
            score: score.unwrap_or(0 as u64),
        }
    }

    fn next(&self, die: u64) -> Self {
        let next_position = (self.position + die - 1) % 10 + 1;
        Player::new(next_position, Some(self.score + next_position))
    }
}

struct DeterministicDie {
    rolls: u64,
    value: u64,
}

impl DeterministicDie {
    fn new() -> Self {
        DeterministicDie { rolls: 0, value: 1 }
    }

    fn roll(&mut self) -> u64 {
        let roll_sum = (self.value..self.value + 3).sum();

        self.rolls += 3;
        self.value += 3;

        roll_sum
    }
}

fn play_quantum_dice(
    game: Game,
    game_record: &mut GameWinRecord,
    quantum_die_frequency: &QuatumFrequency,
) -> WinCounter {
    if game.is_winner() {
        match game.player1.score > game.player2.score {
            true => WinCounter::with(1, 0),
            false => WinCounter::with(0, 1),
        }
    } else if game_record.contains_key(&game) {
        *game_record.get(&game).unwrap()
    } else {
        let wc = quantum_die_frequency
            .iter()
            .map(|(die, freq)| -> WinCounter {
                return play_quantum_dice(
                    game.next(*die as u64),
                    game_record,
                    quantum_die_frequency,
                )
                .repeat(*freq);
            })
            .fold(WinCounter::new(), |acc, curr| acc + curr);
        game_record.insert(game, wc);
        wc
    }
}

#[derive(Clone, Copy)]
struct WinCounter {
    wins_player1: u64,
    wins_player2: u64,
}

impl WinCounter {
    fn new() -> Self {
        WinCounter {
            wins_player1: 0,
            wins_player2: 0,
        }
    }

    fn with(player1: u64, player2: u64) -> Self {
        WinCounter {
            wins_player1: player1,
            wins_player2: player2,
        }
    }

    fn repeat(&self, times: u64) -> WinCounter {
        WinCounter::with(self.wins_player1 * times, self.wins_player2 * times)
    }

    fn max(&self) -> u64 {
        self.wins_player1.max(self.wins_player2)
    }
}

impl Add for WinCounter {
    type Output = WinCounter;
    fn add(self, rhs: Self) -> Self::Output {
        WinCounter::with(
            self.wins_player1 + rhs.wins_player1,
            self.wins_player2 + rhs.wins_player2,
        )
    }
}
