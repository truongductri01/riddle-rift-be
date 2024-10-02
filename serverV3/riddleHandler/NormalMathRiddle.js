const { shuffleArray } = require("../helpers/arrayHelpers");
const riddleAnswerTypes = require("../types/riddleAnswerTypes");
const riddleQuestionTypes = require("../types/riddleQuestionTypes");
const BaseRiddle = require("./BaseRiddle");

class NormalMathRiddle extends BaseRiddle {
  constructor(answerType) {
    super(answerType);
  }

  generate() {
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
    const correctAnswer = eval(equation); // Be cautious using eval in a real app

    // Step 5: Return both the equation and the answer
    return {
      preQuestion: "What is the value of:",
      question: equation,
      type: riddleQuestionTypes.NORMAL_MATH_RIDDLE,
      questionWillDisappear: false,
      questionAppearTimeLimit: 0,
      answerTimeLimit: 30,
      answer: this.generateAnswer(this.answerType, correctAnswer),
    };
  }

  generateAnswer(type, correctAnswer) {
    if (type === riddleAnswerTypes.SHORT_ANSWER) {
      return {
        type,
        correctAnswer,
        options: [],
      };
    } else if (type === riddleAnswerTypes.MULTIPLE_CHOICE) {
      let randomAddOn = [-1, 0, 1, 2];
      return {
        type,
        correctAnswer,
        options: shuffleArray(
          randomAddOn.map((value) => correctAnswer + value)
        ),
      };
    }
  }

  evaluate(answer, correctAnswer) {
    return `${answer}` === `${correctAnswer}`;
  }
}

module.exports = NormalMathRiddle;
