/**
 *
 * @param {Array} array
 * @returns {Array}
 */
const shuffleArray = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

/**
 *
 * @param {Array} arr
 * @param {number} k
 * @returns
 */
function shuffleKLast(arr, k) {
  if (arr.length < k) {
    throw new Error("for shuffleKLast, array must have length of at least k");
  }

  // Extract the last 4 elements
  let last = arr.slice(-k);

  // Fisher-Yates shuffle algorithm for the last 4 elements
  for (let i = last.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [last[i], last[j]] = [last[j], last[i]];
  }

  // Replace the last 4 elements with the shuffled version
  arr.splice(-k, k, ...last);

  return arr;
}

module.exports = { shuffleArray, shuffleKLast };
