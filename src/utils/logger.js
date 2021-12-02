function logger(input, callback, solutionName = "solution") {
  console.time(solutionName);
  console.log({ result: callback(input) });
  console.timeEnd(solutionName);
}

module.exports = logger;
