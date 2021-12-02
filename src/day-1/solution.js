const input = require("./input");
const { logger } = require("../utils/index");

/*
  199 (N/A - no previous measurement)
  200 (increased)
  208 (increased)
  210 (increased)
  200 (decreased)
  207 (increased)
  240 (increased)
  269 (increased)
  260 (decreased)
  263 (increased)
  result: 7 because 7 measurements are larger than the previous
*/

function measurements(input) {
  let times_increased = 0;
  for (let i = 0; i < input.length; i++) {
    const item = input[i];
    const previous = input[i - 1];
    if (i > 0 && item > previous) {
      times_increased++;
    }
  }
  return times_increased;
}

const result = measurements(input);
logger(result);

/*
  199
  200 
  208 tupleA: [ 199, 200, 208 ] = 607
  210 tupleB: [ 200, 208, 210 ] = 618 --> 618 > 607 = Increased!
  200 
  207
  240
  269
  260
  263
*/

function measurements_part2(input) {
  let times_increased = 0;

  for (let i = 0; i < input.length; i++) {
    if (i + 3 < input.length) {
      const tupleA = [input[i], input[i + 1], input[i + 2]];
      const tupleB = [input[i + 1], input[i + 2], input[i + 3]];

      const sumA = tupleA.reduce((a, b) => a + b, 0);
      const sumB = tupleB.reduce((a, b) => a + b, 0);

      if (sumB > sumA) times_increased++;
    } else {
      break;
    }
  }
  return times_increased;
}

logger(measurements_part2(input));
