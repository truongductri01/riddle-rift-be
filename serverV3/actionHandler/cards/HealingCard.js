const activationTypes = require("../../types/activationTypes");
const BaseCard = require("./BaseCard");
const cardTypes = require("../../types/cardTypes");
const targetTypes = require("../../types/targetTypes");

class HealingCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.ROUND_END,
      type: cardTypes.HEALING,
      id: this.cardId ?? `${cardTypes.HEALING}_${Date.now().toString()}`,
      damage: 0,
      heal: 1,
      counteredBy: null,
      description: `Increase your team's health point by 1`,
      targetType: targetTypes.SELF,
    };
  }
}

module.exports = HealingCard;
