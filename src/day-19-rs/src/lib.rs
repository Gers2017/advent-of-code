#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Vector3 {
    pub x: i32,
    pub y: i32,
    pub z: i32,
}

impl Vector3 {
    pub fn new(x: i32, y: i32, z: i32) -> Self {
        Vector3 { x, y, z }
    }

    pub fn zero() -> Self {
        Vector3 { x: 0, y: 0, z: 0 }
    }

    pub fn from_line(line: &str) -> Self {
        let items: Vec<i32> = line
            .split(",")
            .filter_map(|it| it.parse::<i32>().ok())
            .collect();

        Vector3::new(items[0], items[1], items[2])
    }

    pub fn plus(&self, other: &Vector3) -> Vector3 {
        Vector3::new(self.x + other.x, self.y + other.y, self.z + other.z)
    }

    pub fn minus(&self, other: &Vector3) -> Vector3 {
        Vector3::new(self.x - other.x, self.y - other.y, self.z - other.z)
    }

    pub fn equals(&self, other: &Vector3) -> bool {
        self.x == other.x && self.y == other.y && self.z == other.z
    }

    pub fn manhattan_distance(&self, point: &Vector3) -> i32 {
        (self.x - point.x).abs() + (self.y - point.y).abs() + (self.z - point.z).abs()
    }

    pub fn face(&self, face: usize) -> Vector3 {
        let (x, y, z) = (self.x, self.y, self.z);
        match face {
            0 => *self,
            1 => Vector3::new(x, -y, -z),
            2 => Vector3::new(x, -z, y),
            3 => Vector3::new(-y, -z, x),
            4 => Vector3::new(y, -z, -x),
            5 => Vector3::new(-x, -z, -y),
            _ => panic!("Invalid face id, [0..=5]"),
        }
    }

    pub fn rotate(&self, rotate: usize) -> Vector3 {
        let (x, y, z) = (self.x, self.y, self.z);
        match rotate {
            0 => *self,
            1 => Vector3::new(-y, x, z),
            2 => Vector3::new(-x, -y, z),
            3 => Vector3::new(y, -x, z),
            _ => panic!("Invalid rotate id, [0..=3]"),
        }
    }
}

impl std::fmt::Display for Vector3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "x: {}, y: {}, z: {}", self.x, self.y, self.z)
    }
}

pub type Points = Vec<Vector3>;

#[derive(Debug, Clone)]
pub struct Scanner {
    pub id: String,
    pub points: Points,
    pub position: Vector3,
}

impl Scanner {
    pub fn new(id: String, points: Points, position: Option<Vector3>) -> Self {
        Scanner {
            id,
            points,
            position: position.unwrap_or(Vector3::zero()),
        }
    }

    pub fn from_lines(lines: &Vec<&str>) -> Self {
        let id: String = lines
            .get(0)
            .map(|x| x.replace(" ", "").replace("---", ""))
            .unwrap_or("unknown scanner".to_string());

        if !id.starts_with("scanner") {
            panic!("Invalid scanner id {}", &id);
        }

        let points = lines
            .iter()
            .skip(1)
            .filter(|line| !line.is_empty())
            .map(|line| Vector3::from_line(line))
            .collect::<Vec<_>>();

        Scanner::new(id, points, None)
    }
}

impl std::fmt::Display for Scanner {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} at ({})", self.id, self.position)
    }
}

#[derive(Debug)]
pub struct Transform {
    pub scanner_position: Vector3,
    pub points: Points,
}

impl Transform {
    pub fn new(scanner_position: Vector3, points: Points) -> Self {
        Transform {
            scanner_position,
            points,
        }
    }
}

impl std::fmt::Display for Transform {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "scanner position: {}, points: {}",
            self.scanner_position,
            self.points.len()
        )
    }
}
