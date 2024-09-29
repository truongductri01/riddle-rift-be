const BaseAction = require("./BaseAction");

class DefenseAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "DefenseAction";
  }

  execute(teams) {
    return teams;
  }
}

module.exports = DefenseAction;
