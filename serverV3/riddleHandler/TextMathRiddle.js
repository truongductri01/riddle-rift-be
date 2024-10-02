const { shuffleArray } = require("../helpers/arrayHelpers");
const riddleAnswerTypes = require("../types/riddleAnswerTypes");
const riddleQuestionTypes = require("../types/riddleQuestionTypes");
const BaseRiddle = require("./BaseRiddle");

class TextMathRiddle extends BaseRiddle {
  constructor(answerType) {
    super(answerType);
  }

  generate() {
    let operatorNames = {
      "*": "multiply",
      "+": "add",
      "-": "subtract",
    };

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

    const textQuestion = `If you ${operatorNames["*"]} a number by ${num2} and then ${operatorNames[randomOperator1]} ${num3}, the result is ${correctAnswer}. What is the number?`;

    // In this case, num 1 is the number and the result is the correct answer
    // Step 5: Return both the equation and the answer
    return {
      preQuestion: "What is the value of:",
      question: textQuestion,
      type: riddleQuestionTypes.TEXT_MATH_RIDDLE,
      questionWillDisappear: false,
      questionAppearTimeLimit: 0,
      answerTimeLimit: 30,
      answer: this.generateAnswer(this.answerType, num1),
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
}

module.exports = TextMathRiddle;
