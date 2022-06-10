use std::fs;
use std::collections::HashSet;

fn main() {
    let input = get_input(false);
    println!("Using {}", input);
    let some_area = Area::from(input);
    if some_area.as_ref().is_none() {
        println!("Invalid input");
        return;
    }

    let area = some_area.unwrap();
    let mut velocities: Vec<Vector> = vec![];

    for y in area.get_max_y() - 50..area.get_max_x() {
        for x in 0..area.get_max_x() + 50 {
            velocities.push(Vector::new(x, y));
        }
    }

    let mut launcher = Launcher::new(area);

    for v in velocities {
        launcher.setup(v);
        launcher.launch();
    }

    println!("Highest Y: {}", launcher.get_highest_y());
    println!("Velocities:{}", launcher.get_velocities_count());
}

fn get_input(is_test: bool) -> String {
    if is_test {
        return "target area: x=20..30, y=-10..-5".to_string();
    }
    return fs::read_to_string("input.txt").unwrap();
}

#[derive(Copy, Clone, Debug)]
struct Vector {
    x: i16,
    y: i16,
}

impl std::fmt::Display for Vector {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.as_string())
    }
}

impl Vector {
    fn new(x: i16, y: i16) -> Vector{
        Vector{ x, y }
    }

    fn add(&self, b: &Vector) -> Vector {
        let x = self.x as i16;
        let y = self.y as i16;
        return Vector::new(x + b.x, y + b.y);
    }

    fn as_string(&self) -> String {
        return format!("x: {} y: {}", self.x, self. y).to_string();
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
    fn new(v: Vector) -> Probe {
        Probe { position: Vector::zero(), velocity: v }
    }

    fn restart(&mut self, v: Vector) {
        self.velocity = v;
        self.position = Vector::zero();
    }

    fn apply_velocity(&mut self) {
        let velocity = self.velocity;
        self.position = self.position.add(&velocity);
    }

    
    fn apply_drag(&mut self) {
        if self.velocity.x != 0 {
            let drag = self.velocity.x.signum() * -1;
            self.velocity.x += drag;
        }
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
    end: Vector
}

impl Area {
    fn from(line: String) -> Option<Area>{
        if !line.starts_with("target area:") {
            return None;
        }

        let ranges= line.replace("target area: ", "")
            .trim().to_owned()
            .split(", ")
            .map(|x| {
                x[2..].split("..")
                    .filter_map(|s| s.parse::<i16>().ok())
                    .collect::<Vec<i16>>()
            })
            .collect::<Vec<_>>();

        let range_x = &ranges[0];
        let range_y = &ranges[1];

        return Some(Area {
            start: Vector::new(range_x[0], range_y[0]),
            end: Vector::new(range_x[1], range_y[1])
        });
    }

    fn get_max_x(&self) -> i16 { self.end.x }
    fn get_max_y(&self) -> i16 { self.end.y }
    fn get_min_x(&self) -> i16 { self.start.x }
    fn get_min_y(&self) -> i16 { self.start.y }

    fn contains(&self, point: Vector) -> bool {
        return 
            self.get_min_x() <= point.x && point.x <= self.get_max_x()
            && self.get_min_y() <= point.y && point.y <= self.get_max_y();
    }
}

struct Launcher {
    probe: Probe,
    area: Area,
    heights: Vec<i16>,
    velocities: HashSet<String>,
}

impl Launcher {
    fn new(area: Area) -> Launcher {
        return Launcher{
            area,
            probe: Probe::new(Vector::zero()),
            heights: vec![],
            velocities: HashSet::new(),
        };
    }

    fn get_highest_y(&mut self) -> i16 {
        self.heights.sort_by(|a, b| b.cmp(a));
        return self.heights.get(0)
            .map_or(0, |x| x.to_owned());
    }

    fn get_velocities_count(&self) -> usize {
        return self.velocities.len();
    }

    fn setup(&mut self, v: Vector) {
        self.probe.restart(v);
    }

    fn is_missing_shot(&self, point: Vector) -> bool {
        return point.x > self.area.get_max_x() 
            || point.y < self.area.get_min_y(); // below the lowest point
    }

    fn launch(&mut self) {
        let init: Vector = self.probe.velocity;
        // println!("Init: {}", init);

        let mut possible_pos: Vec<i16> = vec![];
        let mut in_area = self.area.contains(self.probe.position);

        while !in_area && !self.is_missing_shot(self.probe.position) {
            self.probe.simulate();
            possible_pos.push(self.probe.position.y);
            in_area = self.area.contains(self.probe.position);
            // println!("{}", self.probe.position);
        }

        if in_area {
            // println!("Final: {}", self.probe.position);
            self.heights.extend(possible_pos);
            self.velocities.insert(init.as_string());
        }
    }
}







