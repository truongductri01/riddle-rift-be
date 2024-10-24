const { Express } = require("express");
const riddleFactoryGenerate = require("./riddleHandler/riddleFactoryGenerate");
const { scenario1, yourTeam } = require("./mockGames/scenarios");
const actionHandler = require("./actionHandler/actionHandler");
const riddleQuestionTypes = require("./types/riddleQuestionTypes");

/**
 *
 * @param {Express} app
 */
module.exports = (app) => {
  app.get("/question", async (req, res) => {
    try {
      const { type, answerType } = req.query;

      return res.json(riddleFactoryGenerate(type, answerType).generateRiddle());
    } catch (e) {
      return res.json({ error: `${e}` });
    }
  });

  app.get("/scenario", async (req, res) => {
    const { id } = req.query;

    console.log(id);
    let scenario = scenario1;

    switch (id) {
      case 1:
        scenario = scenario1;
        break;
      default:
        scenario = scenario1;
        break;
    }

    let riddle = riddleFactoryGenerate(
      riddleQuestionTypes.RANDOM
    ).generateRiddle();

    scenario = {
      ...scenario,
      riddle,
    };

    return res.json({
      scenario,
      yourId: yourTeam,
    });
  });

  app.post("/evaluate-scenario", async (req, res) => {
    const { scenario, answer, yourId } = req.body;

    console.log("scenario", req.body, scenario, answer);
    const riddleAnswer = scenario.riddle.answer;
    let updatedScenario = { ...scenario };
    if (answer === riddleAnswer.correctAnswer) {
      updatedScenario = {
        ...updatedScenario,
        hasWinner: true,
        winnerTeamId: yourId,
      };
    }

    return res.json({
      scenario,
      yourId: yourTeam,
    });
  });
};
