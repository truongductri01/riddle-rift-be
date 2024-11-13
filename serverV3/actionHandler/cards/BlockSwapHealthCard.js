const activationTypes = require("../../types/activationTypes");
const cardTypes = require("../../types/cardTypes");
const targetTypes = require("../../types/targetTypes");
const BaseCard = require("./BaseCard");

class BlockSwapHealthCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.ROUND_END,
      type: cardTypes.BLOCK_SWAP_HEALTH,
      id:
        this.cardId ??
        `${cardTypes.BLOCK_SWAP_HEALTH}_${Date.now().toString()}`,
      damage: 0,
      heal: 0,
      counteredBy: null,
      description: `Block Swap Health Card from other team`,
      targetType: targetTypes.SELF,
      cantExistWith: cardTypes.SWAP_HEALTH,
    };
  }
}

module.exports = BlockSwapHealthCard;
