const AttackCard = require("./cards/AttackCard");
const DefenseCard = require("./cards/DefenseCard");
const HealingCard = require("./cards/HealingCard");
const BaseCard = require("./cards/BaseCard");
const ViewOneCard = require("./cards/ViewOneCard");
const StealOneCard = require("./cards/StealOneCard");
const DrawOneCard = require("./cards/DrawOneCard");
const cardTypes = require("./types/cardTypes");
const ShuffleCard = require("./cards/ShuffleCard");
const SwapHealthCard = require("./cards/SwapHealthCard");
const BlockSwapHealthCard = require("./cards/BlockSwapHealthCard");

/**
 *
 * @param {string} type
 * @returns {BaseCard}
 */
module.exports = (type, activator, cardId, targets) => {
  switch (type) {
    case cardTypes.ATTACK:
      return new AttackCard(activator, cardId, targets);
    case cardTypes.DEFENSE:
      return new DefenseCard(activator, cardId, targets);
    case cardTypes.HEALING:
      return new HealingCard(activator, cardId, targets);
    case cardTypes.SHUFFLE:
      return new ShuffleCard(activator, cardId, targets);
    case cardTypes.VIEW_1_CARD:
      return new ViewOneCard(activator, cardId, targets);
    case cardTypes.STEAL_1_CARD:
      return new StealOneCard(activator, cardId, targets);
    case cardTypes.DRAW_1_CARD:
      return new DrawOneCard(activator, cardId, targets);
    case cardTypes.SWAP_HEALTH:
      return new SwapHealthCard(activator, cardId, targets);
    case cardTypes.BLOCK_SWAP_HEALTH:
      return new BlockSwapHealthCard(activator, cardId, targets);
    default:
      throw new Error("No matching type to be created");
  }
};
