const AttackAction = require("./actions/AttackAction");
const BaseAction = require("./actions/BaseAction");
const BlockSwapHealthAction = require("./actions/BlockSwapHealthAction");
const DefenseAction = require("./actions/DefenseAction");
const HealingAction = require("./actions/HealingAction");
const SwapHealthAction = require("./actions/SwapHealthAction");
const TestAction = require("./actions/TestAction");
const WinnerAttackAction = require("./actions/WinnerAttackAction");
const actionTypes = require("../types/actionTypes");
const cardTypes = require("../types/cardTypes");

/**
 *
 * @param {string} type
 * @param {*} cardDetail
 * @param {*} activator
 * @param {Array<string>} targets
 * @returns {BaseAction}
 */
module.exports = (type, cardDetail, activator, targets) => {
  switch (type) {
    case actionTypes.WINNER_ATTACK:
      return new WinnerAttackAction(cardDetail, activator, targets);
    case actionTypes.ATTACK:
      return new AttackAction(cardDetail, activator, targets);
    case actionTypes.DEFENSE:
      return new DefenseAction(cardDetail, activator, targets);
    case actionTypes.HEALING:
      return new HealingAction(cardDetail, activator, targets);
    case actionTypes.SWAP_HEALTH:
      return new SwapHealthAction(cardDetail, activator, targets);
    case actionTypes.BLOCK_SWAP_HEALTH:
      return new BlockSwapHealthAction(cardDetail, activator, targets);
    default:
      return new TestAction(cardDetail, activator, targets);
  }
};
