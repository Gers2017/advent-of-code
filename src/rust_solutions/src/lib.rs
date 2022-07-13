use std::{env, fs};
pub mod day_19;

pub enum InputMode {
    #[allow(dead_code)]
    Real,
    #[allow(dead_code)]
    Test,
}

pub fn get_input(mode: InputMode, day: usize) -> String {
    let filename = match mode {
        InputMode::Real => "input.txt",
        InputMode::Test => "input_test.txt",
    };

    let cwd = env::current_dir().unwrap();
    let filepath = cwd
        .join("src")
        .join(format!("day_{:02}", day))
        .join(filename);

    fs::read_to_string(&filepath).unwrap()
}
