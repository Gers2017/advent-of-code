import { get_input, InputMode } from "../utils/helpers.ts";

const input = get_input(InputMode.Real).join("").split(",").map(Number);
let school = new Array<number>(9).fill(0);
for (const unique of new Set(input)) {
    school[unique] = input.filter((v) => v === unique).length;
}

function simulate(initial_state: number[]) {
    const school = initial_state
        .slice()
        .map((_, i, arr) => (i + 1 < arr.length ? arr[i + 1] : arr[0]))
        .map((v, i, arr) => (i == 6 ? v + arr[8] : v));
    return school;
}

const days = 256;
for (let i = 0; i < days; i++) {
    school = simulate(school);
}
const count = school.reduce((a, b) => a + b, 0);
console.log(`Simulated ${days} days, count: ${count}`);
console.log(`final school: ${school}`);
