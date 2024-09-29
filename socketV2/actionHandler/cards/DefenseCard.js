const activationTypes = require("../types/activationTypes");
const BaseCard = require("./BaseCard");
const cardTypes = require("../types/cardTypes");
const targetTypes = require("../types/targetTypes");

class DefenseCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.ROUND_END,
      type: cardTypes.DEFENSE,
      id: this.cardId ?? `${cardTypes.DEFENSE}_${Date.now().toString()}`,
      damage: 0,
      heal: 0,
      counteredBy: null,
      description: `Block one attack against your team`,
      targetType: targetTypes.SELF,
    };
  }
}

module.exports = DefenseCard;
