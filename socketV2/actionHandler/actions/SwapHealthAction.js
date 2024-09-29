const BaseAction = require("./BaseAction");

class SwapHealthAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "SwapHealthAction";
  }

  execute(teams) {
    let winnerTeam = teams[this.activator];
    let teamToBeSwitched = teams[this.targets[0]];

    let winnerHealth = winnerTeam.healthPoint;
    let teamToBeSwitchedHealth = teamToBeSwitched.healthPoint;

    return {
      ...teams,
      [this.activator]: { ...winnerTeam, healthPoint: teamToBeSwitchedHealth },
      [this.targets[0]]: { ...teamToBeSwitched, healthPoint: winnerHealth },
    };
  }
}

module.exports = SwapHealthAction;
