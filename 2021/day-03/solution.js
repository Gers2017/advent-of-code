import { get_input } from "../utils/helpers.ts";
const my_input = get_input(1);

/**
 * @param {string[]} input
 * @returns {string[][]}
 */
function getInputColumns(input) {
    const columns = {};
    input.forEach((value) => {
        value.split("").forEach((char, index) => {
            !columns[index]
                ? (columns[index] = [char])
                : columns[index].push(char);
        });
    });
    return Object.values(columns);
}

function solution(input) {
    const columns = getInputColumns(input);

    const gamma_values = [];
    const epsilon_values = [];

    columns.forEach((column) => {
        const ones = column.filter((val) => val === "1").length;
        const zeros = column.length - ones;

        const most_common = ones > zeros ? 1 : 0;
        gamma_values.push(most_common);
        epsilon_values.push(Number(!most_common));
    });

    const gamma = parseBinary(gamma_values.join(""));
    const epsilon = parseBinary(epsilon_values.join(""));
    return gamma * epsilon;
}

function parseBinary(binary) {
    return parseInt(binary, 2);
}

// logger(solution(my_input));

/**
 * @param {string[]} input
 */
function part2(input) {
    let oxygen = input.slice();
    for (let j = 0; j < input[0].length; j++) {
        // get the count of ones and zeros
        const count = { 0: 0, 1: 0 };

        oxygen.forEach((n) => {
            // n[j] == "00100"[2] == 1
            // count["1"] ? count["1"] += 1 : count["1"] = 0
            const digit = n[j];
            count[digit] !== undefined
                ? (count[digit] += 1)
                : (count[digit] = 0);
        });

        const most = count["1"] >= count["0"] ? "1" : "0";

        // keep the numbers with the most common byte in the current index J
        oxygen = oxygen.filter((digit) => digit[j] === most);

        if (oxygen.length === 1) break;
    }

    let CO2 = input.slice();
    for (let k = 0; k < input[0].length; k++) {
        const count = { 0: 0, 1: 0 };

        CO2.forEach((n) => {
            const digit = n[k];
            count[digit] !== undefined
                ? (count[digit] += 1)
                : (count[digit] = 0);
        });

        const less = count["1"] >= count["0"] ? "0" : "1";

        // keep the numbers with the less common byte in the current index K
        CO2 = CO2.filter((digit) => digit[k] === less);

        if (CO2.length === 1) break;
    }

    console.log({ oxygen, CO2, ex_oxygen: "10111", ex_CO2: "01010" });
    return parseInt(oxygen[0], 2) * parseInt(CO2[0], 2);
}
console.log(part2(my_input));
