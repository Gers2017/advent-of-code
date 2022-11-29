export enum InputMode {
    Real = 0,
    Test = 1,
}

const real_filename = "input.txt";
const test_filename = "input_test.txt";

function read_file(filename: string): string {
    return Deno.readTextFileSync(filename).trim();
}

export function get_input(mode: InputMode) {
    const filename = mode == InputMode.Real ? real_filename : test_filename;
    return read_file(filename).split("\n");
}

export function get_input_raw(mode: InputMode) {
    const filename = mode == InputMode.Real ? real_filename : test_filename;
    return read_file(filename);
}
