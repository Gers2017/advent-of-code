#[derive(Clone, Copy, Debug)]
pub struct Range {
    pub start: u32,
    pub end: u32,
}

impl Range {
    pub fn overlaps(&self, other: &Range) -> bool {
        self.start <= other.start && self.end >= other.end
    }

    pub fn partially_overlaps(&self, other: &Range) -> bool {
        self.start >= other.start && self.start <= other.end // start in range(other.start, other,end)
            || self.end >= other.start && self.end <= other.end // // end in range(other.start, other,end)
    }
}
