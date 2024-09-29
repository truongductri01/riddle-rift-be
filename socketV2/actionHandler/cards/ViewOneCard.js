const activationTypes = require("../types/activationTypes");
const BaseCard = require("./BaseCard");
const cardTypes = require("../types/cardTypes");
const targetTypes = require("../types/targetTypes");

class ViewOneCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.INSTANT,
      type: cardTypes.VIEW_1_CARD,
      id: this.cardId ?? `${cardTypes.VIEW_1_CARD}_${Date.now().toString()}`,
      damage: 0,
      heal: 0,
      counteredBy: null,
      description: `Choose another team to see one random card of them`,
      targetType: targetTypes.SINGLE_TARGET,
    };
  }
}

module.exports = ViewOneCard;
