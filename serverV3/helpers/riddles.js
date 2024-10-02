/**
 * @typedef {Object} MathEquationRiddle
 * @property {string} preQuestion
 * @property {string} question
 * @property {string} type
 * @property {string} answer
 */

const challengeTypes = {
  SHORT_ANSWER: "short_answer",
  MULTIPLE_CHOICE: "multiple_choice",
};

/**
 * @returns {MathEquationRiddle}
 */
const generateMathEquationRiddle = () => {
  // Step 1: Randomly select two numbers between 1 and 10
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const num3 = Math.floor(Math.random() * 10) + 1;

  // Step 2: Randomly choose an operator
  const operators = ["+", "-"];
  const randomOperator1 =
    operators[Math.floor(Math.random() * operators.length)];

  // Step 3: Create the equation as a string
  const equation = `${num1} ${"*"} ${num2} ${randomOperator1} ${num3}`;

  // Step 4: Evaluate the equation to get the correct answer
  const answer = `${eval(equation)}`; // Be cautious using eval in a real app

  // Step 5: Return both the equation and the answer
  return {
    preQuestion: "What is the value of:",
    question: equation,
    type: challengeTypes.SHORT_ANSWER,
    answer,
  };
};

module.exports = { challengeTypes, generateMathEquationRiddle };
