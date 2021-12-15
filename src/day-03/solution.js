const { logger } = require("../utils/index");
const my_input = require("./my_input");

// const my_input = [
//   "00100",
//   "11110",
//   "10110",
//   "10111",
//   "10101",
//   "01111",
//   "00111",
//   "11100",
//   "10000",
//   "11001",
//   "00010",
//   "01010",
// ];

/*
  The power consumption can then be found by multiplying the gamma rate by the epsilon rate.
  gamma most common -> 10110 TO DECIMAL is 22
  epsilon less common -> 01001 TO DECIMAL is 9
  Multiplying the gamma rate (22) by the epsilon rate (9) produces the power consumption, << 22 * 9 = 198 >>
  result = calculate the gamma rate and epsilon rate, then multiply them together
*/
/**
 * @param {string[]} input
 * @returns {string[][]}
 */
function getInputColumns(input) {
  const columns = {};
  input.forEach((value) => {
    value.split("").forEach((char, index) => {
      !columns[index] ? (columns[index] = [char]) : columns[index].push(char);
    });
  });
  return Object.values(columns);
}

function solution(input) {
  const columns = getInputColumns(input);

  let gamma_values = [];
  let epsilon_values = [];

  columns.forEach((column) => {
    let ones = column.filter((val) => val === "1").length;
    let zeros = column.length - ones;

    let most_common = ones > zeros ? 1 : 0;
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
    let count = { 0: 0, 1: 0 };

    oxygen.forEach((n) => {
      // n[j] == "00100"[2] == 1
      // count["1"] ? count["1"] += 1 : count["1"] = 0
      let digit = n[j];
      count[digit] !== undefined ? (count[digit] += 1) : (count[digit] = 0);
    });

    let most = count["1"] >= count["0"] ? "1" : "0";

    // keep the numbers with the most common byte in the current index J
    oxygen = oxygen.filter((digit) => digit[j] === most);

    if (oxygen.length === 1) break;
  }

  let CO2 = input.slice();
  for (let k = 0; k < input[0].length; k++) {
    let count = { 0: 0, 1: 0 };

    CO2.forEach((n) => {
      let digit = n[k];
      count[digit] !== undefined ? (count[digit] += 1) : (count[digit] = 0);
    });

    let less = count["1"] >= count["0"] ? "0" : "1";

    // keep the numbers with the less common byte in the current index K
    CO2 = CO2.filter((digit) => digit[k] === less);

    if (CO2.length === 1) break;
  }

  console.log({ oxygen, CO2, ex_oxygen: "10111", ex_CO2: "01010" });
  return parseInt(oxygen[0], 2) * parseInt(CO2[0], 2);
}

logger(part2(my_input));
