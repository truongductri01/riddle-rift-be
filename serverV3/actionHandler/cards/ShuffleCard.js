const activationTypes = require("../../types/activationTypes");
const BaseCard = require("./BaseCard");
const cardTypes = require("../../types/cardTypes");
const targetTypes = require("../../types/targetTypes");

class ShuffleCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.INSTANT,
      type: cardTypes.SHUFFLE,
      id: this.cardId ?? `${cardTypes.SHUFFLE}_${Date.now().toString()}`,
      damage: 0,
      heal: 0,
      counteredBy: null,
      description: `Shuffle all teams' cards with all the remaining cards that are not dealt. Then re-distribute to each team same amount of card before the shuffle.`,
      targetType: targetTypes.ALL,
    };
  }
}

module.exports = ShuffleCard;
