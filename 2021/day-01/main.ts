import { get_input } from "../utils/helpers.ts";

function measurements_increased(values: number[]) {
    return values.filter((depth, i, depths) => {
        return i > 0 && depths[i - 1] < depth;
    }).length;
}

function solve_part1(input: string[]) {
    const increased = measurements_increased(input.map(Number));
    console.log("Part1:", increased);
}

function solve_par2(input: string[]) {
    const triplet_sums = input
        .map(Number)
        .reduce<number[]>((ls, _depth, i, depths) => {
            if (i + 3 <= depths.length) {
                const sum = depths.slice(i, i + 3).reduce((a, b) => a + b, 0);
                ls.push(sum);
            }

            return ls;
        }, []);

    const increased = measurements_increased(triplet_sums);
    console.log("Part2:", increased);
}

const input = get_input(0);
solve_part1(input);
solve_par2(input);
