export function get_input(is_test: number) {
    const filename = is_test == 0 ? "input.txt" : "input_test.txt";
    return Deno.readTextFileSync(filename).trimEnd().split("\n");
}
