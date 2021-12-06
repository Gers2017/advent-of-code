const { readFileSync } = require("fs");
const { join } = require("path");

/**
 *
 * @param {string} cwd
 * @param {string} filename
 * @returns {string}
 */
function readfile(cwd, filename) {
  try {
    return readFileSync(join(cwd, filename), { encoding: "utf8" });
  } catch (e) {
    console.error(e);
  }
}
/**
 * @param {string} cwd
 * @param {string} filename
 * @returns {string[]}
 */
function readfilelines(cwd, filename) {
  try {
    return readfile(cwd, filename).split("\n");
  } catch (e) {
    console.error(e);
  }
}
/**
 * @param {string} text
 * @param {RegExp} regex
 * @returns { { original_text: string, values: string[] } }
 */
function extract(text, regex) {
  let match = regex.exec(text);
  if (!match) throw Error(`Invalid text '${text}', regex: ${regex}`);
  return { original_text: match[0], values: match.slice(1) };
}

module.exports = {
  readfile,
  readfilelines,
  extract,
};
