#[allow(dead_code)]
pub enum Part {
    One,
    Two,
}

pub struct InputBuilder {
    raw_text: String,
}

impl InputBuilder {
    pub fn new(filename: String) -> Self {
        let raw_text = std::fs::read_to_string(&filename)
            .expect(format!("Missing file: {}", &filename).as_str());
        Self { raw_text }
    }

    pub fn raw(&self) -> String {
        self.raw_text.clone()
    }

    pub fn split_lines(&self) -> Vec<String> {
        self.raw_text
            .split("\n")
            .map(|it| it.to_string())
            .collect::<Vec<_>>()
    }

    pub fn split_double_lines(&self) -> Vec<String> {
        self.raw_text
            .split("\n\n")
            .map(|it| it.to_string())
            .collect::<Vec<_>>()
    }
}
