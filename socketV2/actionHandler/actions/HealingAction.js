const BaseAction = require("./BaseAction");

class HealingAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "HealingAction";
  }

  execute(teams) {
    return {
      ...teams,
      [this.activator]: {
        ...teams[this.activator],
        healthPoint: teams[this.activator].healthPoint + this.actionDetail.heal,
      },
    };
  }
}

module.exports = HealingAction;
