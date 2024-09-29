let BaseAction = require("./BaseAction");

class TestAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "TestAction";
  }

  execute(teams) {
    console.log("testing");
  }

  combine(anotherState) {
    console.log("testing combine");
  }
}

module.exports = TestAction;
