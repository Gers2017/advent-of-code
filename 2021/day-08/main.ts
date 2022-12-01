import { get_input, InputMode } from "../utils/helpers.ts";
type Entry = { input_signals: string[]; output_signals: string[] };
//                     0  1  2  3  4  5  6  7  8  9
const DIGIT_LENGTHS = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

function exclude(a: string, b: string) {
    return a.split("").filter((it) => !b.includes(it));
}

function merge_digits(a: string, b: string) {
    const c = a + b;
    const unique_chars = new Set<string>(c);
    return [...unique_chars].join("");
}

function sorted_string(s: string) {
    return s
        .split("")
        .sort((a, b) => a.localeCompare(b))
        .join("");
}

function get_signal_balance(
    item: string,
    model_signal: string
): [number, number] {
    const not_in_model = exclude(item, model_signal).length;
    const not_in_item = exclude(model_signal, item).length;
    return [not_in_item, not_in_model];
}

function solve_signal_map(entry: Entry) {
    const digit_map: Record<number, string> = {};
    const { input_signals } = entry;
    for (const inp of input_signals) {
        if (inp.length === DIGIT_LENGTHS[1]) digit_map[1] = inp;
        if (inp.length === DIGIT_LENGTHS[7]) digit_map[7] = inp;
        if (inp.length === DIGIT_LENGTHS[4]) digit_map[4] = inp;
        if (inp.length === DIGIT_LENGTHS[8]) digit_map[8] = inp;
    }

    const solved = new Set<string>();

    const find_signals_with_len = (length: number) =>
        input_signals.filter((it) => it.length === length && !solved.has(it));

    const insert_to_digit_map = (digit: number, value: string) => {
        digit_map[digit] = value;
        solved.add(value);
    };

    // find nine
    const partial_nine = merge_digits(digit_map[4], digit_map[7]);
    const nine = find_signals_with_len(6).filter(
        (it) => exclude(it, partial_nine).length === 1
    );
    insert_to_digit_map(9, nine[0]);

    // find two
    for (const item of find_signals_with_len(5)) {
        const [not_in_two, not_in_nine] = get_signal_balance(
            item,
            digit_map[9]
        );
        if (not_in_two === 2 && not_in_nine === 1) {
            insert_to_digit_map(2, item);
            break;
        }
    }

    // find five
    for (const item of find_signals_with_len(5)) {
        const [not_in_five, not_in_two] = get_signal_balance(
            item,
            digit_map[2]
        );
        if (not_in_five === 2 && not_in_two === 2) {
            insert_to_digit_map(5, item);
            break;
        }
    }

    // find three, only 3 has length 5 after solving 5 and 2
    const three = find_signals_with_len(5)[0];
    insert_to_digit_map(3, three);

    // find six, length six: 0,6,9
    for (const item of find_signals_with_len(6)) {
        const [not_in_six, not_in_five] = get_signal_balance(
            item,
            digit_map[5]
        );
        // console.log("item", item, { not_in_six, not_in_five });
        if (not_in_six === 0 && not_in_five === 1) {
            insert_to_digit_map(6, item);
            break;
        }
    }

    // find zero, only 0 is left after solving 6 and 9
    const zero = find_signals_with_len(6)[0];
    insert_to_digit_map(0, zero);

    // console.log("DIGIT_MAP:", digit_map);
    // console.log("SOLVED:", solved);

    const signal_to_digit: Record<string, number> = {};
    Object.entries(digit_map).forEach(([key, value]) => {
        const digit = Number(key);
        const signal = sorted_string(value);
        signal_to_digit[signal] = digit;
    });

    return signal_to_digit;
}

function get_output_result(entry: Entry) {
    let result = "";

    const signal_map = solve_signal_map(entry);
    for (const out of entry.output_signals) {
        if (!out) throw Error("Hey your output is undefined!");
        const signal = sorted_string(out);
        result += signal_map[signal].toString();
    }

    return Number(result);
}

function get_total_output(entries: Entry[]) {
    return entries
        .map((entry) => get_output_result(entry))
        .reduce((acc, x) => acc + x);
}

function solve_part1(mode: InputMode) {
    const outputs = get_input(mode)
        .map((line) => line.split(" | ")[1])
        .map((line) => line.split(" "))
        .flat();

    const output_lengths = [2, 3, 4, 7]; // length of 1, 7, 4, 8
    const result = outputs.filter((x) => output_lengths.includes(x.length));
    console.log("Digits 1, 4, 7, 8:", result.length);
}

function solve_part2(mode: InputMode) {
    const entries: Entry[] = get_input(mode).map((line) => {
        const [l, r] = line.split(" | ").map((part) => part.split(" "));
        return { input_signals: l, output_signals: r };
    });

    const total_output = get_total_output(entries);
    console.log("Total output:", total_output);
}

const input_mode = InputMode.Real;
solve_part1(input_mode);
solve_part2(input_mode);
