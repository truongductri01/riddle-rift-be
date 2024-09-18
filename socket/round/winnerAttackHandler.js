const { Server, Socket } = require("socket.io");
const eventNames = require("../eventNames");
const { getGame, storeGameRequest } = require("../../api/gameApis");
const roundStages = require("../helpers/roundStages");

/**
 *
 * @param {Server} io
 * @param {Socket} socket
 */
module.exports = (io, socket) => {
  const cardTypes = {
    ATTACK: "Attack",
    DEFENSE: "Defense",
    HEALING: "Healing",
  };

  const cards = {
    [cardTypes.ATTACK]: {
      // this will be combine with the attack to be counted as 1 action
      activateOnAttack: true, // only effective if on attack
      damage: 1,
      heal: 0,
      counter: null,
      countered: cardTypes.DEFENSE,
    },
    [cardTypes.DEFENSE]: {
      activateOnAttack: false, // only effective if on attack
      damage: 0,
      heal: 0,
      type: cardTypes.DEFENSE,
      countered: null,
    },
    [cardTypes.HEALING]: {
      activateOnAttack: false, // only effective if on attack
      damage: 0,
      heal: 1,
      type: cardTypes.HEALING,
      countered: null,
    },
  };

  /**
   * @typedef {Object} card
   * @property {string} id
   * @property {string} type
   *
   * @typedef {Object} returnType
   * @property {Object} teams
   * @property {Array} activeActions
   * @property {Array} counteredActions
   * @property {Array} uselessActions
   *
   * @param {string} winnerTeamId
   * @param {string} targetTeamId
   * @param {Object} cardsToUsed
   * @returns
   */
  function processActions(winnerTeamId, targetTeamId, cardsToUsed, teams) {
    // each action:
    // actor, target, damage, heal, counter
    let cardsVisited = new Set();
    let winnerActions = []; // [teamId] : list of actions
    let updatedCardsToUsed = { ...cardsToUsed };

    let activeActions = [];
    let counteredActions = [];
    let uselessActions = [];

    // have to combine the cards with Attack power into the action of the winner
    // start with the winner and check the attack cards first
    if (winnerTeamId) {
      let increasedDamage = 0;
      let attackCardsUsed = [];
      for (let cardInfo of cardsToUsed[winnerTeamId]) {
        if (cardInfo.type === cardTypes.ATTACK) {
          increasedDamage += cards[cardTypes.ATTACK].damage;
          attackCardsUsed.push(cardInfo);
          cardsVisited.add(cardInfo.id);
        }
      }

      winnerActions.push({
        actor: winnerTeamId,
        target: targetTeamId,
        damage: 3 + increasedDamage,
        heal: 0,
        countered: cards[cardTypes.ATTACK].countered,
        cards: attackCardsUsed,
      });
    }

    // 2. handle those that countered each other first?
    // if an action from A => B has a countered and is used by B => stoped
    // start with the cards of the winner and go on
    // for a cards that deal damage from A => B, check cards of B that can counter the cards A used
    // => if exist => add B card to used, and add A's to countered
    // repeat until all cards get processed

    for (let action of winnerActions) {
      let isCountered = false;
      for (let cardInfo of cardsToUsed[action.target]) {
        if (cardInfo.type === action.countered) {
          isCountered = true;
          let card = cards[cardInfo.type];

          activeActions.push({
            actor: action.target,
            target: action.actor,
            damage: card.damage,
            heal: card.heal,
            countered: card.countered,
            cards: [cardInfo],
          });
          counteredActions.push(action);
          cardsVisited.add(cardInfo.id);
          break;
        }
      }

      if (!isCountered) {
        activeActions.push(action);
      }
    }

    // do this after countered all actions from the winning team
    for (let teamId in cardsToUsed) {
      for (let cardInfo of cardsToUsed[teamId]) {
        if (!cardsVisited.has(cardInfo.id)) {
          let card = cards[cardInfo.type];
          let action = {
            actor: teamId,
            target: null,
            damage: card.damage,
            heal: card.heal,
            countered: card.countered,
            cards: [cardInfo],
          };

          if (cardInfo.type !== cardTypes.HEALING) {
            uselessActions.push(action);
          } else {
            action.target = teamId;
            activeActions.push(action);
          }

          cardsVisited.add(cardInfo.id);
        }
      }
    }

    let updatedTeams = { ...teams };

    // 3. have a list of cards to be used
    // 4. calculate the new health point based on that.
    for (let action of activeActions) {
      // now calculate the health point
      // use the action on the target
      let teamAffected = updatedTeams[action.target];
      console.log("team affected >>>", action, teamAffected);
      teamAffected = {
        ...teamAffected,
        healthPoint: teamAffected.healthPoint + (action.heal - action.damage),
      };

      updatedTeams = { ...updatedTeams, [teamAffected.id]: teamAffected };
    }

    return {
      teams: updatedTeams,
      activeActions,
      uselessActions,
      counteredActions,
    };
  }

  socket.on(eventNames.on.winnerAttack, async (teamId, gameId = "game1") => {
    // the id of the team to be attacked

    console.log("attacking >>>", teamId);
    let game = await getGame(gameId);
    const { currentRound, teams } = game;
    let updatedGame = { ...game };
    let updatedCurrentRound = {
      ...currentRound,
      attackedTeamId: teamId,
      stage: roundStages.CALCULATE_RESULT,
    };

    updatedGame = { ...updatedGame, currentRound: updatedCurrentRound };
    await storeGameRequest(updatedGame);
    io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

    // TODO: process the result before sending
    let result = processActions(
      updatedCurrentRound.winnerTeamId,
      updatedCurrentRound.attackedTeamId,
      updatedCurrentRound.cardsToUsed,
      teams
    );

    console.log("Result >>>", result);

    updatedCurrentRound = {
      ...updatedCurrentRound,
      stage: roundStages.RESULT,
      result,
    };
    updatedGame = {
      ...updatedGame,
      currentRound: updatedCurrentRound,
      teams: result.teams,
    };
    await storeGameRequest(updatedGame);
    io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);

    // if there is one single team left with health point more than 0
    let teamsMoreThanOneHealthCount = 0;
    let finalWinner = "";
    for (let teamId in result.teams) {
      let team = result.teams[teamId];
      if (team.healthPoint > 0) {
        teamsMoreThanOneHealthCount += 1;
        finalWinner = team.id;
      }
    }

    if (teamsMoreThanOneHealthCount === 1) {
      updatedGame = { ...updatedGame, finalWinner };
      await storeGameRequest(updatedGame);
      io.to(`${game.id}`).emit(eventNames.emit.gameStatusChange, game.id);
    }
  });
};
