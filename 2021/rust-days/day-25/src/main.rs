use std::collections::HashMap;

use day_25::*;
use rust_days::{get_input, InputMode};

fn main() {
    let lines = get_input(InputMode::Real).expect("Couldn't read input file!");
    let max_y = lines.len();
    let max_x = lines[0].len();

    let mut grid = Grid {
        map: HashMap::new(),
        max_x,
        max_y,
    };

    println!("rows:{} cols:{}", max_y, max_x);

    for y in 0..max_y {
        let chars = lines[y].chars().collect::<Vec<_>>();
        for x in 0..max_x {
            if chars[x] == '.' {
                continue;
            }
            let point = Point {
                x: x as u16,
                y: y as u16,
            };

            grid.map.insert(point, chars[x]);
        }
    }

    let times = solve(&grid);
    println!("Loops: {}", times);
    // println!("{}", &grid);
}

fn simulate(grid: &Grid) -> Grid {
    let mut new_grid = grid.clone();

    let z = generate_zip(&new_grid, true);

    for (prev, next) in z.iter() {
        new_grid.map.remove(prev);
        new_grid.map.insert(*next, '>');
    }

    let z = generate_zip(&new_grid, false);

    for (prev, next) in z.iter() {
        new_grid.map.remove(prev);
        new_grid.map.insert(*next, 'v');
    }

    new_grid
}

fn solve(grid: &Grid) -> usize {
    let mut _prev_grid: Option<Grid> = None;
    let mut times: usize = 0;
    let mut grid: Grid = grid.to_owned();

    loop {
        _prev_grid = Some(grid.clone());
        grid = simulate(&grid);
        times += 1;

        if deep_equals(&_prev_grid.unwrap(), &grid) {
            break;
        }
    }

    times
}
