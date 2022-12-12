#[derive(PartialEq, Eq, Debug, Clone, Copy)]
pub enum Part {
    One,
    Two,
}

impl std::fmt::Display for Part {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use Part::*;
        let name = match self {
            One => "Part1",
            Two => "Part2",
        };
        write!(f, "{}", name)
    }
}

#[derive(PartialEq, Eq, Debug, Clone, Copy)]
pub enum InputMode {
    Test,
    Real,
}

pub struct InputBuilder {
    raw_text: String,
}

impl InputBuilder {
    pub fn new(input_mode: InputMode) -> Self {
        let filename = InputBuilder::get_filename(input_mode);
        let raw_text = std::fs::read_to_string(&filename)
            .expect("Couldn't read input file")
            .trim_end()
            .to_string();
        Self { raw_text }
    }

    pub fn get_filename(input_mode: InputMode) -> String {
        match input_mode {
            InputMode::Real => String::from("input.txt"),
            InputMode::Test => String::from("input_test.txt"),
        }
    }

    pub fn raw(&self) -> String {
        self.raw_text.clone()
    }

    pub fn lines_iter(&self) -> impl Iterator<Item = &str> + '_ {
        self.raw_text.split("\n")
    }

    pub fn lines(&self) -> Vec<String> {
        self.lines_iter().map(|it| it.to_string()).collect()
    }

    pub fn double_lines_iter(&self) -> impl Iterator<Item = &str> + '_ {
        self.raw_text.split("\n\n")
    }

    pub fn double_lines(&self) -> Vec<String> {
        self.double_lines_iter()
            .map(|it| it.to_string())
            .collect::<Vec<_>>()
    }
}
