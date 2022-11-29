use std::collections::HashMap;

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Point {
    pub x: u16,
    pub y: u16,
}

impl Point {
    pub fn right(&self, max_x: u16) -> Point {
        let x = if self.x + 1 == max_x { 0 } else { self.x + 1 };
        Point { x, y: self.y }
    }

    pub fn down(&self, max_y: u16) -> Point {
        let y = if self.y + 1 == max_y { 0 } else { self.y + 1 };
        Point { x: self.x, y: y }
    }
}

#[derive(Clone)]
pub struct Grid {
    pub max_x: usize,
    pub max_y: usize,
    pub map: HashMap<Point, char>,
}

impl std::fmt::Display for Grid {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut s = String::new();

        for y in 0..self.max_y {
            for x in 0..self.max_x {
                let point = Point {
                    x: x as u16,
                    y: y as u16,
                };
                let ch = self.map.get(&point).unwrap_or(&'.');
                s.push(*ch);
            }

            s.push('\n');
        }

        write!(f, "{}", s)
    }
}

pub fn generate_zip(grid: &Grid, is_right: bool) -> Vec<(Point, Point)> {
    let filter_ch = if is_right { '>' } else { 'v' };
    let max_n = if is_right { grid.max_x } else { grid.max_y };
    let max_n = max_n as u16;

    grid.map
        .iter()
        .filter(|(_p, ch)| **ch == filter_ch)
        .map(|(p, _ch)| {
            let next = if is_right {
                p.right(max_n)
            } else {
                p.down(max_n)
            };
            (*p, next)
        })
        .filter(|(_, next)| !grid.map.contains_key(next))
        .collect::<Vec<_>>()
}

pub fn deep_equals(a: &Grid, b: &Grid) -> bool {
    for key in a.map.keys() {
        let a_ch = a.map.get(key).unwrap_or(&'?');
        let b_ch = b.map.get(key).unwrap_or(&'?');

        if a_ch != b_ch {
            return false;
        }
    }

    true
}
