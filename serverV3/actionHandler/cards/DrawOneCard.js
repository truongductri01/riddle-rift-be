const activationTypes = require("../../types/activationTypes");
const BaseCard = require("./BaseCard");
const cardTypes = require("../../types/cardTypes");
const targetTypes = require("../../types/targetTypes");

class DrawOneCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.INSTANT,
      type: cardTypes.DRAW_1_CARD,
      id: this.cardId ?? `${cardTypes.DRAW_1_CARD}_${Date.now().toString()}`,
      damage: 0,
      heal: 0,
      counteredBy: null,
      description: `Draw one card from the deck`,
      targetType: targetTypes.SELF,
    };
  }
}

module.exports = DrawOneCard;
