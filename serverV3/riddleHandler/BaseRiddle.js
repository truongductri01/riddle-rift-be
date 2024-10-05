const riddleAnswerTypes = require("../types/riddleAnswerTypes");

class BaseRiddle {
  constructor(answerType) {
    if (this.constructor === BaseRiddle) {
      throw new Error("Abstract Riddle Base class can't be instantiated.");
    }

    this.answerType = answerType;
  }

  // recipe pattern
  generateRiddle() {
    let riddle = this.generate();
    let isValidRiddle = this.validateRiddleGenerated(riddle);

    if (!isValidRiddle) {
      throw new Error("Not a valid riddle");
    }
    return riddle;
  }

  generate() {
    throw new Error("Method `generate()` must be implemented");
  }

  validateRiddleGenerated(riddle) {
    let riddleKeys = [
      "preQuestion",
      "question",
      "type",
      "answer",
      "questionWillDisappear",
      "questionAppearTimeLimit",
      "answerTimeLimit",
    ];
    let answerKeys = ["type", "correctAnswer", "options"];

    for (let key of riddleKeys) {
      if (!(key in riddle)) {
        throw new Error(`Missing ${key} for riddle`);
      }
    }

    for (let key of answerKeys) {
      if (!(key in riddle.answer)) {
        throw new Error(`Missing ${key} for riddle.answer`);
      }
    }

    return true;
  }

  evaluate(answer, correctAnswer) {
    return `${answer}` === `${correctAnswer}`;
  }
}

module.exports = BaseRiddle;
