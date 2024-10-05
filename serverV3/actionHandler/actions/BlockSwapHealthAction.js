const BaseAction = require("./BaseAction");

class BlockSwapHealthAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "BlockSwapHealthAction";
  }

  execute(teams) {
    return teams;
  }
}

module.exports = BlockSwapHealthAction;
