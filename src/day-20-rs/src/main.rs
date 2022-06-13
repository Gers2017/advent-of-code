use std::fmt::Display;

fn main() {
    part_1();
}

fn part_1() {
    let mut player1 = Player::new(10, 1000);
    let mut player2 = Player::new(8, 1000);
    println!("Player1 {}, Player2 {}", player1, player2);

    let mut dice = RatchetDice::new();

    loop {
        let rolls = dice.next_range(3);
        // let dices_str = dices.iter().map(|x| x.to_string()).collect::<Vec<_>>();
        // print!("{}", dices_str.join("+"));
        let rolls_sum = rolls.iter().sum();

        player1.add_position(rolls_sum);
        // println!("P1 Moves {}, {}", dice_sum, player1);

        if player1.is_winner() {
            println!("Player1 wins with {}", player1.score);
            let p2_result = player2.score * dice.rolled;
            println!(
                "Results: Rolled: {}, P2: {}, Total: {}",
                dice.rolled, player2.score, p2_result
            );
            break;
        }

        let dices = dice.next_range(3);
        // let dices_str = dices.iter().map(|x| x.to_string()).collect::<Vec<_>>();
        // print!("{}", dices_str.join("+"));
        let dice_sum = dices.iter().sum();

        player2.add_position(dice_sum);
        // println!("P2 Moves {}, {}", dice_sum, player2);

        if player2.is_winner() {
            println!("Player2 wins");
            let p1_result = player1.score * dice.rolled;
            println!(
                "Results: Rolled: {}, P2: {}, Total: {}",
                dice.rolled, player1.score, p1_result
            );
            break;
        }
    }
}

fn part_2() {
    let players = vec![Player::new(10, 21), Player::new(8, 21)];
}

#[derive(Debug)]
struct Player {
    position: i32,
    score: i32,
    win_score: i32,
}

impl Player {
    fn new(position: i32, win_score: i32) -> Self {
        Player {
            position,
            score: 0,
            win_score,
        }
    }

    fn is_winner(&self) -> bool {
        self.score >= self.win_score
    }

    fn add_position(&mut self, amount: i32) {
        let possible_pos = self.position + amount;
        if possible_pos % 10 == 0 {
            self.position = 10;
            self.score += self.position;
            return;
        }

        self.position = possible_pos % 10;
        self.score += self.position;
    }
}

impl Display for Player {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "position: {}, score: {}", self.position, self.score)
    }
}

struct RatchetDice {
    index: i32,
    rolled: i32,
}

impl RatchetDice {
    fn new() -> Self {
        RatchetDice {
            index: 1,
            rolled: 0,
        }
    }

    fn next(&mut self) -> i32 {
        self.rolled += 1;

        let current_index = self.index;
        let next_index = if self.index + 1 > 100 {
            1
        } else {
            self.index + 1
        };
        self.index = next_index;

        current_index
    }

    fn next_range(&mut self, n: i16) -> Vec<i32> {
        (0..n).map(|_x| self.next()).collect::<Vec<_>>()
    }
}

struct QuantumDice {
    // TODO
}
