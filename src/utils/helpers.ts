export enum InputMode {
    Real = 0,
    Test = 1,
}

export function get_input(mode: InputMode) {
    const filename = mode == InputMode.Real ? "input.txt" : "input_test.txt";
    return Deno.readTextFileSync(filename).trimEnd().split("\n");
}
