const roundStages = require("../helpers/roundStages");
const actionGenerator = require("./actionGenerator");
const BaseAction = require("./actions/BaseAction");
const cardGenerateFactory = require("./cardGenerateFactory");
const actionTypes = require("./types/actionTypes");
const cardTypes = require("./types/cardTypes");
const targetTypes = require("./types/targetTypes");

let cardsCanBeExecutedEvenLose = [
  cardTypes.HEALING,
  cardTypes.SWAP_HEALTH,
  cardTypes.BLOCK_SWAP_HEALTH,
];

let cardsShouldBeActivatedLast = [cardTypes.SWAP_HEALTH];

/**
 * @param {import("../typeDef/typeDef").CurrentRound} currentRound
 * @param {Object<string, import("../typeDef/typeDef").Team>} teams
 * @param {import("../typeDef/typeDef").CardDataFireStore} cards
 * @returns {Object}
 */
module.exports = (currentRound, teams, cards) => {
  // should take the state of the game
  // handle with determine who to take the action first, how to create action ...
  // Winner action should be a separate one
  // that can be combine with AttackAction to increase the damage (for now) => return a new Winner Action

  if (
    currentRound.stage !== roundStages.INSTANT_CARD_SESSION &&
    currentRound.stage !== roundStages.CALCULATE_RESULT
  ) {
    throw new Error(
      "Cannot execute actions unless for Instant Card or Result stage"
    );
  }

  // if instant stage
  if (currentRound.stage === roundStages.INSTANT_CARD_SESSION) {
    // based on the turnTeamId to get the cards being used
    // update the card of each team too
    // for draw, shuffle, or steal action
  } else if (currentRound.stage === roundStages.CALCULATE_RESULT) {
    return handleResultStageActions(currentRound, teams, cards);
  }
};

/**
 * @param {import("../typeDef/typeDef").CurrentRound} currentRound
 * @param {Object<string, import("../typeDef/typeDef").Team>} teams
 * @param {import("../typeDef/typeDef").CardDataFireStore} cards
 * @returns {Object}
 */
function handleResultStageActions(currentRound, teams, cards) {
  const { winnerTeamId, attackedTeamId, cardsToUsed } = currentRound;

  // set up
  let cardsVisited = new Set();
  /** @type {Array<BaseAction>} */
  let winnerActions = []; // [teamId] : list of actions

  let potentialActions = [];
  let activeActions = [];
  let counteredActions = [];
  let uselessActions = [];

  if (winnerTeamId) {
    let winnerAttackAction = actionGenerator(
      actionTypes.WINNER_ATTACK,
      null,
      winnerTeamId,
      [attackedTeamId]
    );

    for (let cardInfo of cardsToUsed[winnerTeamId]) {
      if (cardInfo.type === cardTypes.ATTACK) {
        let attackCard = cardGenerateFactory(
          cardTypes.ATTACK,
          winnerTeamId,
          cardInfo.id,
          [attackedTeamId]
        );

        let attackAction = attackCard.toAction();
        winnerAttackAction.combine(attackAction);

        cardsVisited.add(cardInfo.id);
      }
    }

    winnerActions.push(winnerAttackAction);
    potentialActions.push(winnerAttackAction);
  }

  // after winner action
  for (let teamId in cardsToUsed) {
    for (let cardInfo of cardsToUsed[teamId]) {
      if (!cardsVisited.has(cardInfo.id)) {
        let card = cardGenerateFactory(
          cardInfo.type,
          teamId,
          cardInfo.id,
          cardInfo.targets ?? []
        );
        let action = card.toAction();

        if (cardsCanBeExecutedEvenLose.includes(cardInfo.type)) {
          potentialActions.push(action);
        } else {
          uselessActions.push(action);
          cardsVisited.add(cardInfo.id);
        }
      }
    }
  }

  for (let action of potentialActions) {
    if (cardsVisited.has(action.cardDetail?.id)) {
      break;
    }

    let isCountered = false;
    if (
      action.isWinnerAttack() ||
      action.cardDetail.targetType === targetTypes.SINGLE_TARGET ||
      action.cardDetail.targetType === targetTypes.MULTIPLE
    ) {
      for (let targetId of action.targets) {
        for (let cardInfo of cardsToUsed[targetId]) {
          if (cardInfo.type === action.actionDetail?.counteredBy) {
            isCountered = true;
            let card = cardGenerateFactory(
              cardInfo.type,
              targetId,
              cardInfo.id,
              cardInfo.targets ?? []
            );

            activeActions.push(card.toAction());
            counteredActions.push(action);
            cardsVisited.add(cardInfo.id);
            break;
          }
        }
      }
    }

    if (!isCountered) {
      activeActions.push(action);
      if (action.cardDetail?.id) {
        cardsVisited.add(action.cardDetail?.id);
      }
    }
  }

  let updatedTeams = { ...teams };

  let lastActivateActions = [];
  for (let action of activeActions) {
    if (cardsShouldBeActivatedLast.includes(action.actionDetail.type)) {
      lastActivateActions.push(action);
      continue;
    }

    updatedTeams = { ...action.execute(updatedTeams) };
  }
  for (let action of lastActivateActions) {
    updatedTeams = { ...action.execute(updatedTeams) };
  }

  return {
    teams: updatedTeams,
    activeActions: activeActions.map((action) => action.toJson()),
    uselessActions: uselessActions.map((action) => action.toJson()),
    counteredActions: counteredActions.map((action) => action.toJson()),
    cards: cards,
  };
}
