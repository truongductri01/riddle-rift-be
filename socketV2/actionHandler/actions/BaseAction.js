class BaseAction {
  /**
   *
   * @param {*} cardDetail
   * @param {*} activator
   * @param {*} targets
   */
  constructor(cardDetail, activator, targets) {
    if (this.constructor === BaseAction) {
      throw new Error("Abstract class 'BaseAction' can't be instantiated.");
    }
    this.name = "BaseAction";
    this.cardDetail = cardDetail;
    this.actionDetail = { ...cardDetail };
    this.activator = activator;
    this.targets = targets;
    this.cards = [];

    if (cardDetail?.id) {
      this.cards = [...this.cards, { ...this.cardDetail }];
    }
  }

  /**
   * @typedef State
   *
   * @param {State} state
   * @return {State}
   */
  execute(teams) {
    throw new Error("Method 'execute()' must be implemented");
  }

  /**
   * @param {BaseAction} anotherAction
   */
  combine(anotherAction) {
    throw new Error("Method 'combine()' must be implemented");
  }

  isWinnerAttack() {
    return false;
  }

  toJson() {
    return {
      actionName: this.name,
      actionDetail: this.actionDetail,
      activator: this.activator,
      cards: this.cards ?? [],
      targets: this.targets,
    };
  }
}

module.exports = BaseAction;
