const actionTypes = require("../types/actionTypes");
let BaseAction = require("./BaseAction");

class WinnerAttackAction extends BaseAction {
  constructor(cardDetail, activator, targets) {
    super(cardDetail, activator, targets);

    this.name = "WinnerAttackAction";
    this.actionDetail = {
      ...this.actionDetail,
      damage: 3,
      heal: 0,
      counteredBy: actionTypes.DEFENSE,
    };
  }

  isWinnerAttack() {
    return true;
  }

  execute(teams) {
    let newTeams = { ...teams };

    for (let targetTeamId of this.targets) {
      newTeams = {
        ...newTeams,
        [targetTeamId]: {
          ...newTeams[targetTeamId],
          healthPoint:
            newTeams[targetTeamId].healthPoint -
            this.actionDetail.damage +
            this.actionDetail.heal,
        },
      };
    }

    return newTeams;
  }

  /**
   *
   * @param {BaseAction} anotherAction
   */
  combine(anotherAction) {
    if (anotherAction.actionDetail?.type !== actionTypes.ATTACK) {
      throw new Error("Cannot combine with other Action");
    }

    this.actionDetail = {
      ...this.actionDetail,
      damage:
        this.actionDetail.damage + (anotherAction.actionDetail?.damage ?? 0),
      heal: this.actionDetail.heal + (anotherAction.actionDetail?.heal ?? 0),
    };
    this.cards = [
      ...this.cards,
      {
        ...anotherAction.cardDetail,
      },
    ];
  }
}

module.exports = WinnerAttackAction;
