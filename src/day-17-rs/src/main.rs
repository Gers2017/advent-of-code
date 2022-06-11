use std::collections::HashSet;
use std::{fs, io, num};

fn main() -> Result<(), Error> {
    let input = get_input(Mode::File)?;
    println!("Using {}", input);
    let area = Area::new(input)?;

    let max_y = area.max_y().clone() - 50;
    let max_x = area.max_x().clone() + 50;

    let velocities = (max_y..max_x)
        .map(move |y| (0..max_x).map(move |x| Vector::new(x, y)))
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
enum Error {
    Input(io::Error),
    ParseArea(num::ParseIntError),
    InvalidArea,
}
enum Mode {
    #[allow(dead_code)]
    Test,
    #[allow(dead_code)]
    File,
}
fn get_input(mode: Mode) -> Result<String, Error> {
    match mode {
        Mode::Test => Ok("target area: x=20..30, y=-10..-5".to_string()),
        Mode::File => fs::read_to_string("input.txt").map_err(Error::Input),
    }
}

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
struct Vector {
    x: i16,
    y: i16,
}

impl std::fmt::Display for Vector {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "x: {}, y: {}", self.x, self.y)
    }
}

impl std::ops::AddAssign for Vector {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

impl Vector {
    fn new(x: i16, y: i16) -> Vector {
        Vector { x, y }
    }

    fn zero() -> Vector {
        Vector::new(0, 0)
    }
}

struct Probe {
    position: Vector,
    velocity: Vector,
}

impl Probe {
    fn new(velocity: Vector) -> Probe {
        Probe {
            position: Vector::zero(),
            velocity,
        }
    }

    fn restart(&mut self, velocity: Vector) {
        self.velocity = velocity;
        self.position = Vector::zero();
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
    start: Vector,
    end: Vector,
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
            start: Vector::new(range_x[0], range_y[0]),
            end: Vector::new(range_x[1], range_y[1]),
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

    fn contains(&self, point: Vector) -> bool {
        (self.min_x()..=self.max_x()).contains(&point.x)
            && (self.min_y()..=self.max_y()).contains(&point.y)
    }
}

struct Launcher {
    probe: Probe,
    area: Area,
    heights: Vec<i16>,
    velocities: HashSet<Vector>,
}

impl Launcher {
    fn new(area: Area) -> Launcher {
        return Launcher {
            area,
            probe: Probe::new(Vector::zero()),
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

    fn setup(&mut self, velocity: Vector) {
        self.probe.restart(velocity);
    }

    fn is_missing_shot(&self, point: Vector) -> bool {
        // below the lowest point
        return point.x > self.area.max_x() || point.y < self.area.min_y();
    }

    fn launch(&mut self) {
        let init: Vector = self.probe.velocity;
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
