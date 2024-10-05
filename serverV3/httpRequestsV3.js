const { Express } = require("express");
const riddleFactoryGenerate = require("./riddleHandler/riddleFactoryGenerate");

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
};
