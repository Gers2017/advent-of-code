use std::fs;
use std::io::Result as IOResult;

pub mod vec2d;

#[allow(dead_code)]
pub enum InputMode {
    Real,
    Test,
}

pub fn get_input(mode: InputMode) -> IOResult<String> {
    let input_raw = get_input_raw(mode);
    input_raw.map(|x| x.split('\n').map(|x| x.to_string()).collect())
}

pub fn get_input_raw(mode: InputMode) -> Result<String, std::io::Error> {
    let file = match mode {
        InputMode::Real => "input.txt",
        InputMode::Test => "input_test.txt",
    };

    fs::read_to_string(file)
}
