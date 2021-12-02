const input = require("./input");
const { logger } = require("../utils/index");

/*
  forward 5
  down 5
  forward 8
  up 3
  down 8
  forward 2
 */

function extractValue(str) {
  return Number(str.split(" ")[1]);
}

function solution(input) {
  const data = { position: 0, depth: 0 };
  for (const item of input) {
    const character = item[0];

    if (character === "f") {
      data.position += extractValue(item);
    } else if (character === "d") {
      data.depth += extractValue(item);
    } else if (character === "u") {
      data.depth -= extractValue(item);
    }
  }
  return data.depth * data.position;
}

logger(solution(input), "solution part 1");

function solution_part2(input) {
  const data = { position: 0, depth: 0, aim: 0 };
  for (const item of input) {
    const character = item[0];

    if (character === "f") {
      let value = extractValue(item);
      data.position += value;
      data.depth += data.aim * value;
    } else if (character === "d") {
      data.aim += extractValue(item);
    } else if (character === "u") {
      data.aim -= extractValue(item);
    }
  }

  return data.depth * data.position;
}

logger(solution_part2(input), "solution part 2");
