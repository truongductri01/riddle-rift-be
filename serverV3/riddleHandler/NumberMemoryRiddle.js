const { shuffleArray, shuffleKLast } = require("../helpers/arrayHelpers");
const riddleAnswerTypes = require("../types/riddleAnswerTypes");
const riddleQuestionTypes = require("../types/riddleQuestionTypes");
const BaseRiddle = require("./BaseRiddle");

class NumberMemoryRiddle extends BaseRiddle {
  constructor(answerType) {
    super(answerType);
  }

  generate() {
    let arrayOfRandomNumber = [];

    // 1. generate 6 randoms number
    for (let i = 0; i < 6; i++) {
      let num = Math.floor(Math.random() * 20) + 1;
      arrayOfRandomNumber.push(num);
    }

    // 2. correct answer is the arrayOfRandomNumber
    let memoryTime = 15; // seconds

    // 3. Generate answer and return
    return {
      preQuestion: `Remember the follow sequence in ${memoryTime} seconds`,
      question: arrayOfRandomNumber.join(", "),
      type: riddleQuestionTypes.NUMBER_MEMORY_RIDDLE,
      questionWillDisappear: true,
      questionAppearTimeLimit: 15,
      answerTimeLimit: 30,
      answer: this.generateAnswer(this.answerType, arrayOfRandomNumber),
    };
  }

  /**
   *
   * @param {string} type
   * @param {Array} correctAnswer
   * @returns
   */
  generateAnswer(type, correctAnswer) {
    if (type === riddleAnswerTypes.SHORT_ANSWER) {
      return {
        type,
        correctAnswer: correctAnswer.join(", "),
        options: [],
      };
    } else if (type === riddleAnswerTypes.MULTIPLE_CHOICE) {
      let randomAnswers = [correctAnswer.join(", ")];

      for (let i = 0; i < 3; i++) {
        let newAnswer = shuffleKLast([...correctAnswer], 4).join(", ");
        while (randomAnswers.includes(newAnswer)) {
          newAnswer = shuffleKLast([...correctAnswer], 4).join(", ");
        }
        randomAnswers.push(newAnswer);
      }

      return {
        type,
        correctAnswer: correctAnswer.join(", "),
        options: shuffleArray(randomAnswers),
      };
    }
  }
}

module.exports = NumberMemoryRiddle;
