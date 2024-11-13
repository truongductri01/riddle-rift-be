const activationTypes = require("../../types/activationTypes");
const BaseCard = require("./BaseCard");
const cardTypes = require("../../types/cardTypes");
const targetTypes = require("../../types/targetTypes");

class AttackCard extends BaseCard {
  constructor(activator, cardId, targets) {
    super(activator, cardId, targets);
  }

  setCardDetails() {
    this.details = {
      activation: activationTypes.ROUND_END,
      type: cardTypes.ATTACK,
      id: this.cardId ?? `${cardTypes.ATTACK}_${Date.now().toString()}`,
      damage: 1,
      heal: 0,
      counteredBy: cardTypes.DEFENSE,
      description: `Increase your next attack damage (only if you are the winner) by 1. Will be countered by '${cardTypes.DEFENSE}' card`,
      targetType: targetTypes.COMBINE_WITH_WINNER_ATTACH,
      cantExistWith: null,
    };
  }
}

module.exports = AttackCard;
