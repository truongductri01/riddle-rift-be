const { shuffleArray, shuffleKLast } = require("../helpers/arrayHelpers");
const riddleAnswerTypes = require("../types/riddleAnswerTypes");
const riddleQuestionTypes = require("../types/riddleQuestionTypes");
const BaseRiddle = require("./BaseRiddle");

class ColorMemoryRiddle extends BaseRiddle {
  constructor(answerType) {
    if (answerType !== riddleAnswerTypes.MULTIPLE_CHOICE) {
      throw new Error("Color memory should only be multiple choice");
    }

    super(answerType);

    this.defaultColors = {
      BLACK: "#000000",
      WHITE: "#FFFFFF",
      ORANGE: "#FFA500",
      CYAN: "#00FFFF",
      GREEN: "#00FF00",
      PURPLE: "#800080",
      APRICOT: "#FBCEB1",
      BLUE: "#0000FF",
    };
  }

  generate() {
    // 1 generate random colors order
    let allColors = Object.values(this.defaultColors);

    let randomColors = shuffleArray(shuffleArray(allColors)).slice(-5);

    // 2. correct answer is the arrayOfRandomNumber
    let memoryTime = 7; // seconds

    // 3. Generate answer and return
    return {
      preQuestion: `Remember the follow color sequence in ${memoryTime} seconds. Then choose the correct answer!`,
      question: randomColors.join(", "),
      type: riddleQuestionTypes.COLOR_MEMORY_RIDDLE,
      questionWillDisappear: true,
      questionAppearTimeLimit: memoryTime,
      answerTimeLimit: 30,
      answer: this.generateAnswer(this.answerType, randomColors),
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
        let newAnswer = shuffleKLast(
          [...correctAnswer],
          correctAnswer.length
        ).join(", ");
        while (randomAnswers.includes(newAnswer)) {
          newAnswer = shuffleKLast(
            [...correctAnswer],
            correctAnswer.length
          ).join(", ");
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

module.exports = ColorMemoryRiddle;
