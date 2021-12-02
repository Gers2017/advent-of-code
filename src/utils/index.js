function logger(result, solutionName = "solution") {
  console.time(solutionName);
  console.dir(
    { result },
    {
      depth: null,
    }
  );
  console.timeEnd(solutionName);
}

function are_equal(self, other) {
  const equals = self === other;
  console.log(`** ${self} ${equals ? "equals" : "does not equal"} ${other}`);
  return equals;
}

module.exports = {
  logger,
  are_equal,
};