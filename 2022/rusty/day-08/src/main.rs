use rusty::*;

fn main() {
    let items: Vec<_> = InputBuilder::new(InputMode::Real)
        .lines_iter()
        .map(|line| -> Vec<_> {
            line.chars()
                .map(|ch| ch.to_digit(10).expect("Invalid number") as usize)
                .collect()
        })
        .collect();

    let grid = Grid::new(items);
    let mut visible_count = grid.rows * 2 + (grid.columns - 2) * 2;
    let mut highest_scenic_score = 0;

    for y in 1..(grid.rows - 1) {
        for x in 1..(grid.columns - 1) {
            let (score, is_visible) = grid.get_scenic_score_and_is_visible(y, x);

            if is_visible {
                visible_count += 1;
            }

            highest_scenic_score = highest_scenic_score.max(score);
        }
    }

    println!("{}", visible_count);
    println!("{}", highest_scenic_score);
}

struct Grid {
    pub rows: usize,
    pub columns: usize,
    pub items: Vec<Vec<usize>>,
}

impl Grid {
    fn new(items: Vec<Vec<usize>>) -> Self {
        Self {
            rows: items.len(),
            columns: items[0].len(),
            items,
        }
    }

    fn get(&self, row: usize, col: usize) -> usize {
        self.items[row][col]
    }

    fn get_scenic_score_and_is_visible(&self, row: usize, col: usize) -> (usize, bool) {
        let value = self.get(row, col);
        let mut visible = vec![true, true, true, true];
        let mut scores = vec![0, 0, 0, 0];

        // to right
        for ncol in (col + 1)..self.columns {
            scores[0] += 1;

            if self.get(row, ncol) >= value {
                visible[0] = false;
                break;
            }
        }

        // to left
        for ncol in (0..col).rev() {
            scores[1] += 1;

            if self.get(row, ncol) >= value {
                visible[1] = false;
                break;
            }
        }

        // to top
        for nrow in (0..row).rev() {
            scores[2] += 1;
            if self.get(nrow, col) >= value {
                visible[2] = false;
                break;
            }
        }

        // to bottom
        for nrow in (row + 1)..self.rows {
            scores[3] += 1;
            if self.get(nrow, col) >= value {
                visible[3] = false;
                break;
            }
        }

        (
            scores.iter().fold(1, |acc, item| acc * item),
            visible.iter().any(|it| *it),
        )
    }
}
