#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Vector2d {
    pub x: i16,
    pub y: i16,
}

impl std::fmt::Display for Vector2d {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "x: {}, y: {}", self.x, self.y)
    }
}

impl std::ops::AddAssign for Vector2d {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

impl Vector2d {
    pub fn new(x: i16, y: i16) -> Vector2d {
        Vector2d { x, y }
    }

    pub fn zero() -> Vector2d {
        Vector2d::new(0, 0)
    }
}
