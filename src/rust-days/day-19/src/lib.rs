const DESIRED_COUNT: usize = 12;

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

impl std::ops::AddAssign for Vector3 {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
        self.z += rhs.z;
    }
}

impl std::ops::SubAssign for Vector3 {
    fn sub_assign(&mut self, rhs: Self) {
        self.x -= rhs.x;
        self.y -= rhs.y;
        self.z -= rhs.z;
    }
}

impl std::fmt::Display for Vector3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "x: {}, y: {}, z: {}", self.x, self.y, self.z)
    }
}

pub type Scanner = Vec<Vector3>;

#[derive(Clone, Debug)]
pub struct ScannerSet {
    pub id: usize,
    // pub scanner: Vec<Vector3>,
    pub position: Vector3,
}

impl ScannerSet {
    pub fn new(id: usize, position: Vector3) -> ScannerSet {
        ScannerSet {
            id,
            // scanner,
            position,
        }
    }
}

impl std::fmt::Display for ScannerSet {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Set [{}] position: {}", self.id, self.position)
    }
}

pub fn get_input_as_scanners(input: String) -> Vec<Scanner> {
    input
        .split("\n\n")
        .map(|text| -> Scanner {
            let lines = text.split("\n");
            lines
                .filter(|line| !line.starts_with("---") && line.len() > 0)
                .map(Vector3::from_line)
                .collect()
        })
        .collect()
}

pub fn find_transform(left_scanner: &[Vector3], right_scanner: &[Vector3]) -> Option<Transform> {
    for face in 0..6 {
        for rot in 0..4 {
            let reoriented: Vec<Vector3> = right_scanner
                .iter()
                .map(|point| point.face(face).rotate(rot))
                .collect();

            for left in left_scanner.iter() {
                for right in reoriented.iter() {
                    let difference = left.minus(&right);
                    let moved: Vec<Vector3> =
                        reoriented.iter().map(|it| it.plus(&difference)).collect();

                    if intersection_count(&moved, &left_scanner) >= DESIRED_COUNT {
                        return Some(Transform {
                            scanner_position: difference,
                            points: moved,
                        });
                    }
                }
            }
        }
    }

    None
}

fn intersection_count(list_iter: &[Vector3], list_compare: &[Vector3]) -> usize {
    let mut count = 0 as usize;
    for a in list_iter.iter() {
        if list_compare.contains(a) {
            count += 1;
        }
    }
    count
}

#[derive(Debug)]
pub struct Transform {
    pub scanner_position: Vector3,
    pub points: Vec<Vector3>,
}

pub struct ManhattanResult {
    pub a: Vector3,
    pub b: Vector3,
    pub distance: i32,
}

pub fn get_highest_distance(points: &[Vector3]) -> ManhattanResult {
    let mut result = ManhattanResult {
        a: Vector3::zero(),
        b: Vector3::zero(),
        distance: 0,
    };

    walk(0, points, &mut result);

    result
}

fn walk(i: usize, points: &[Vector3], r: &mut ManhattanResult) {
    // base case
    if i == points.len() - 1 {
        return;
    }

    // pre --
    let current = points[i];

    for j in (i + 1)..points.len() {
        let other = points[j];
        let dist = current.manhattan_distance(&other);
        if dist > r.distance {
            r.distance = dist;
            r.a = current;
            r.b = other;
        }
    }

    // recurse
    walk(i + 1, points, r);
}
