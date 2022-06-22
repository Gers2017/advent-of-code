import { get_input, InputMode } from "../utils/helpers.ts";

type Bit = "1" | "0";
type BitCount = { "0": number; "1": number };

function extract_cols(grid: string[][]) {
    const map = new Map<number, string[]>();
    const get_or_default = (key: number, value: string[]) => {
        return map.get(key) || value;
    };

    grid.forEach((row) => {
        row.forEach((bit, index) => {
            const array = get_or_default(index, []);
            array.push(bit);
            map.set(index, array);
        });
    });

    return Array.from(map.values());
}

function get_bit_count(bits: string[]): BitCount {
    const count = { "0": 0, "1": 0 };
    bits.forEach((bit) => {
        count[bit as Bit] += 1;
    });
    return count;
}

function get_most_common(count: BitCount) {
    return count["1"] >= count["0"] ? "1" : "0";
}

function get_least_common(count: BitCount) {
    return count["1"] >= count["0"] ? "0" : "1";
}

function bits_to_int(bits: string[]) {
    return parseInt(bits.join(""), 2);
}

function invert_bits(bits: string[]) {
    return bits.map((b) => (b === "1" ? "0" : "1"));
}

const grid = get_input(InputMode.Real).map((line) => line.split(""));
const columns = extract_cols(grid);
const most_common_bits = columns.map((column) =>
    get_most_common(get_bit_count(column))
);

const gamma = bits_to_int(most_common_bits);
const epsilon = bits_to_int(invert_bits(most_common_bits));

console.log(gamma * epsilon, {
    gamma,
    epsilon,
});

function filter_bits(bits: string[][], get_target: (count: BitCount) => Bit) {
    let i = 0;
    while (bits.length > 1) {
        const count = { "0": 0, "1": 0 };
        bits.forEach((row) => {
            count[row[i] as Bit] += 1;
        });

        const target = get_target(count);
        bits = bits.filter((rows) => rows[i] === target);
        i++;
    }

    return bits_to_int(bits[0]);
}

const oxygen = filter_bits(grid.slice(), get_most_common);
const co2 = filter_bits(grid.slice(), get_least_common);

console.log(oxygen * co2, {
    oxygen,
    co2,
});
