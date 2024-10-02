const activationTypes = require("../../types/activationTypes");
const cardTypes = require("../../types/cardTypes");
const targetTypes = require("../../types/targetTypes");
const BaseCard = require("./BaseCard");

class SwapHealthCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.ROUND_END,
      type: cardTypes.SWAP_HEALTH,
      id: this.cardId ?? `${cardTypes.SWAP_HEALTH}_${Date.now().toString()}`,
      damage: 0,
      heal: 0,
      counteredBy: cardTypes.BLOCK_SWAP_HEALTH,
      description: `Choose another team and swap your team's health with theirs`,
      targetType: targetTypes.SINGLE_TARGET,
    };
  }
}

module.exports = SwapHealthCard;
