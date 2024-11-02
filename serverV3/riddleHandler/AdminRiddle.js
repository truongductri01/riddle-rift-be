const riddleQuestionTypes = require("../types/riddleQuestionTypes");
const BaseRiddle = require("./BaseRiddle");

class AdminRiddle extends BaseRiddle {
  constructor(answerType) {
    super(answerType);
  }

  generate() {
    return {
      preQuestion: "The admin will give the challenge",
      question: "Wait for the decision",
      type: riddleQuestionTypes.ADMIN,
      questionWillDisappear: false,
      questionAppearTimeLimit: 0,
      answerTimeLimit: 30,
      answer: { type: "", correctAnswer: null, options: [] },
    };
  }

  generateAnswer(type, correctAnswer) {}

  evaluate(answer, correctAnswer) {
    return `${answer}` === `${correctAnswer}`;
  }
}

module.exports = AdminRiddle;
