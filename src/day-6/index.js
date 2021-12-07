const { readFileSync } = require("fs")
const { join } = require("path")

let initialState = readFileSync(join(__dirname, "input.txt"), { encoding: "utf-8" }).split(",").map(Number).sort()
let school = Array.from(Array(9).fill(0));

let uniqueStateValues = new Set(initialState);

for (const uniqueValue of uniqueStateValues) {
  school[uniqueValue] = initialState.filter((v) => v === uniqueValue).length;
}

/**
 *  @typedef { {school:number[], days: number, count: number} } simulation
 */

/**
 * 
 * @param {number[]} school 
 * @param {number} days 
 * @returns { simulation }
 */
function simulate(school, days) {
  let schoolCopy = school.slice()
  for (let d = 0; d < days; d++) {
    schoolCopy = simulateDay(schoolCopy)
  }
  return {
    school: schoolCopy,
    day: days,
    count: schoolCopy.reduce((prev, curr) => prev + curr, 0),
  }
}


/**
 * @param {number[]} initSchool 
 */
function simulateDay(initSchool) {
  let school = [...initSchool];

  // decrease timer
  for (let i = 0; i + 1 < school.length; i++) {
    school[i] = school[i + 1];
  }

  // new fishes are on index 8 and new reseted fishes are on index 6
  school[8] = initSchool[0]
  school[6] += initSchool[0]

  return school;
}

/**
 * @param {number[]} school 
 * @param {number} days 
 * @returns {simulation}
 */
function smol(school, days) {
  for (let d = 0; d < days; d++) {
    school = school.slice().map((_, i) => {
      return (i < school.length - 1) ? school[i + 1] : school[0];
    });
    school[6] += school[8];
  }
  return { school, days, count: school.reduce((prev, curr) => prev + curr, 0), }
}


let days = 256;
console.log(simulate(school, days));
// console.log(smol(school, days));