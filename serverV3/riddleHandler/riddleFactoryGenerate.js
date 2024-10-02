const { shuffleArray } = require("../helpers/arrayHelpers");
const riddleAnswerTypes = require("../types/riddleAnswerTypes");
const riddleQuestionTypes = require("../types/riddleQuestionTypes");
const ColorMemoryRiddle = require("./ColorMemoryRiddle");
const NormalMathRiddle = require("./NormalMathRiddle");
const NumberMemoryRiddle = require("./NumberMemoryRiddle");
const TextMathRiddle = require("./TextMathRiddle");

const generateRiddle = (type, answerType) => {
  switch (type) {
    case riddleQuestionTypes.NORMAL_MATH_RIDDLE:
      return new NormalMathRiddle(answerType);
    case riddleQuestionTypes.TEXT_MATH_RIDDLE:
      return new TextMathRiddle(answerType);
    case riddleQuestionTypes.NUMBER_MEMORY_RIDDLE:
      return new NumberMemoryRiddle(answerType);
    case riddleQuestionTypes.COLOR_MEMORY_RIDDLE:
      return new ColorMemoryRiddle(answerType);
    case riddleQuestionTypes.RANDOM:
      let questionTypes = Object.values(riddleQuestionTypes).filter(
        (v) => v != riddleQuestionTypes.RANDOM
      );
      let answerTypes = Object.values(riddleAnswerTypes);

      let randomType = shuffleArray(shuffleArray(questionTypes))[0];
      let randomAnswerType = shuffleArray(answerTypes)[0];

      return generateRiddle(randomType, randomAnswerType);
    default:
      return new NormalMathRiddle(answerType);
  }
};

module.exports = (type, answerType) => {
  if (type === riddleQuestionTypes.RANDOM) {
    return generateRiddle(riddleQuestionTypes.RANDOM);
  }

  if (!type) {
    throw new Error("Question type must be specified");
  } else if (!answerType) {
    throw new Error("For question type not random, answer Type is require");
  } else if (!riddleQuestionTypes[type]) {
    throw new Error(
      `Invalid answer type: ${type}. Should be one of the following choice: [${Object.keys(
        riddleQuestionTypes
      ).join(", ")}]`
    );
  } else if (!riddleAnswerTypes[answerType]) {
    throw new Error(
      `Invalid answer type: ${answerType}. Should be one of the following choice: [${Object.keys(
        riddleAnswerTypes
      ).join(", ")}]`
    );
  }
  return generateRiddle(type, answerType);
};