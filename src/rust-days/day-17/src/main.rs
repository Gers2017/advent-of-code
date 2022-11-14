use std::collections::HashSet;
use std::{io, num};

use rust_days::vec2d::Vector2d;
use rust_days::{get_input_raw, InputMode};

fn main() -> Result<(), Error> {
    let input = get_input_raw(InputMode::Test).map_err(Error::Input)?;
    println!("Using {}", input);
    let area = Area::new(input)?;

    let max_y = area.max_y().clone() - 50;
    let max_x = area.max_x().clone() + 50;

    let velocities = (max_y..max_x)
        .map(move |y| (0..max_x).map(move |x| Vector2d::new(x, y)))
        .flatten()
        .collect::<Vec<_>>();

    let mut launcher = Launcher::new(area);

    for v in velocities {
        launcher.setup(v);
        launcher.launch();
    }

    println!("Highest Y: {}", launcher.get_highest_y());
    println!("Velocities:{}", launcher.get_velocities_count());
    Ok(())
}

#[derive(Debug)]
pub enum Error {
    Input(io::Error),
    ParseArea(num::ParseIntError),
    InvalidArea,
}

struct Probe {
    position: Vector2d,
    velocity: Vector2d,
}

impl Probe {
    fn new(velocity: Vector2d) -> Probe {
        Probe {
            position: Vector2d::zero(),
            velocity,
        }
    }

    fn restart(&mut self, velocity: Vector2d) {
        self.velocity = velocity;
        self.position = Vector2d::zero();
    }

    fn apply_velocity(&mut self) {
        self.position += self.velocity;
    }

    fn apply_drag(&mut self) {
        let drag = self.velocity.x.signum();
        self.velocity.x -= drag;
    }

    fn apply_gravity(&mut self) {
        self.velocity.y -= 1;
    }

    fn simulate(&mut self) {
        self.apply_velocity();
        self.apply_drag();
        self.apply_gravity();
    }
}

struct Area {
    start: Vector2d,
    end: Vector2d,
}

impl Area {
    fn new(line: String) -> Result<Area, Error> {
        if !line.starts_with("target area:") {
            return Err(Error::InvalidArea);
        }

        let ranges: Vec<Vec<i16>> = line
            .replace("target area:", "")
            .trim()
            .split(", ")
            .map(|x| {
                x[2..]
                    .split("..")
                    .map(|s| s.parse().map_err(Error::ParseArea))
                    .collect::<Result<_, _>>()
            })
            .collect::<Result<_, _>>()?;

        let range_x = &ranges[0];
        let range_y = &ranges[1];

        Ok(Area {
            start: Vector2d::new(range_x[0], range_y[0]),
            end: Vector2d::new(range_x[1], range_y[1]),
        })
    }

    fn max_x(&self) -> i16 {
        self.end.x
    }
    fn max_y(&self) -> i16 {
        self.end.y
    }
    fn min_x(&self) -> i16 {
        self.start.x
    }
    fn min_y(&self) -> i16 {
        self.start.y
    }

    fn contains(&self, point: Vector2d) -> bool {
        (self.min_x()..=self.max_x()).contains(&point.x)
            && (self.min_y()..=self.max_y()).contains(&point.y)
    }
}

struct Launcher {
    probe: Probe,
    area: Area,
    heights: Vec<i16>,
    velocities: HashSet<Vector2d>,
}

impl Launcher {
    fn new(area: Area) -> Launcher {
        return Launcher {
            area,
            probe: Probe::new(Vector2d::zero()),
            heights: vec![],
            velocities: HashSet::new(),
        };
    }

    fn get_highest_y(&mut self) -> i16 {
        self.heights.iter().copied().max().unwrap_or(0)
    }

    fn get_velocities_count(&self) -> usize {
        return self.velocities.len();
    }

    fn setup(&mut self, velocity: Vector2d) {
        self.probe.restart(velocity);
    }

    fn is_missing_shot(&self, point: Vector2d) -> bool {
        // below the lowest point
        return point.x > self.area.max_x() || point.y < self.area.min_y();
    }

    fn launch(&mut self) {
        let init: Vector2d = self.probe.velocity;
        let mut possible_pos: Vec<i16> = vec![];
        // println!("Init: {}", init);

        while !self.area.contains(self.probe.position) {
            if self.is_missing_shot(self.probe.position) {
                return;
            }

            self.probe.simulate();
            possible_pos.push(self.probe.position.y);
            // println!("{}", self.probe.position);
        }

        self.heights.extend(possible_pos);
        self.velocities.insert(init);
        // println!("Final: {}", self.probe.position);
    }
}
