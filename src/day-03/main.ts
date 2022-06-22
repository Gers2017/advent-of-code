import { get_input, InputMode } from "../utils/helpers.ts";

type Bit = 1 | 0;
type BitCount = Record<Bit, number>;

const get_most_common = (count: BitCount) => {
    return count[1] >= count[0] ? 1 : 0;
};

const get_least_common = (count: BitCount) => {
    return count[1] >= count[0] ? 0 : 1;
};

function get_bit_count(rows: Bit[][], i: number) {
    const count: BitCount = { 0: 0, 1: 0 };
    rows.forEach((row) => {
        count[row[i]] += 1;
    });
    return count;
}

function count_bits(list: Bit[]) {
    const count = (bit: Bit) => list.filter((b) => b === bit).length;

    return [0, 1].reduce<BitCount>(
        (record, value) => {
            const bit = value as Bit;
            record[bit] = count(bit);
            return record;
        },
        { 0: 0, 1: 0 }
    );
}

function invert_bits(bits: Bit[]) {
    return bits.map((b: Bit) => Number(!b) as Bit);
}

function bits_to_int(bits: Bit[]) {
    return parseInt(bits.join(""), 2);
}

class Diagnostic {
    rows: Bit[][];
    columns: Bit[][];

    constructor(bit_list: string[]) {
        this.rows = bit_list.map((line) =>
            line.split("").map((n) => Number(n) as Bit)
        );

        this.columns = Object.values(
            this.rows.reduce<Record<number, Bit[]>>((map, row) => {
                row.forEach((bit, i) => {
                    map[i] ? map[i].push(bit) : (map[i] = [bit]);
                });
                return map;
            }, {})
        );
    }

    calculate_gamma_epsilon() {
        const result_bits = this.columns
            .map((bits) => count_bits(bits))
            .map(get_most_common);
        const gamma = bits_to_int(result_bits);
        const epsilon = bits_to_int(invert_bits(result_bits));
        console.log(gamma * epsilon, {
            gamma,
            epsilon,
        });
    }

    calculate_oxygen_co2() {
        let oxygen_list = this.rows.slice();
        let co2_list = this.rows.slice();

        let i = 0;
        while (oxygen_list.length > 1) {
            const oxygen_count = get_bit_count(oxygen_list, i);
            const most_common = get_most_common(oxygen_count);
            oxygen_list = oxygen_list.filter((rows) => rows[i] === most_common);
            i++;
        }

        let j = 0;
        while (co2_list.length > 1) {
            const co2_count = get_bit_count(co2_list, j);
            const least_common = get_least_common(co2_count);
            co2_list = co2_list.filter((rows) => rows[j] === least_common);
            j++;
        }

        const oxygen = bits_to_int(oxygen_list[0]);
        const co2 = bits_to_int(co2_list[0]);
        console.log(oxygen * co2, {
            oxygen,
            co2,
        });
    }
}

const diagnostic = new Diagnostic(get_input(InputMode.Real));
diagnostic.calculate_gamma_epsilon();
diagnostic.calculate_oxygen_co2();
