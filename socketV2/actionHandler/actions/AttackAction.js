const BaseAction = require("./BaseAction");

class AttackAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "AttackAction";
  }

  execute(teams) {
    throw new Error(
      "cannot execute by itself, should be combined with WinnerAttackAction"
    );
  }
}

module.exports = AttackAction;
