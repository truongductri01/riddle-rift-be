/**
 * @typedef {Object} Config
 * @property {Object} cardsAmountConfig
 * @property {Number} maxCard
 * @property {Array} teams
 * @property {Number} maxHealth
 */

const cardGenerateFactory = require("../actionHandler/cardGenerateFactory");
const BaseCard = require("../actionHandler/cards/BaseCard");

/**
 * @param {Config} config
 * @returns {Array<BaseCard>}
 */
const createCards = async (config) => {
  let cards = [];
  for (let cardType in config.cardsAmountConfig) {
    let amount = config.cardsAmountConfig[cardType];
    for (let i = 0; i < amount; i++) {
      cards.push(cardGenerateFactory(cardType, "", Date.now().toString()));
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
  }

  return cards;
};

/**
 *
 * @param {Config} config
 * @param {Array<BaseCard>} cards
 */
const dealCardsForTeam = (config, cards) => {
  // get a list of teams id
  let teams = config.teams;
  let teamIdList = teams.map((t) => t.id);

  // generate a list of random index for each team
  // or, shuffle the cards, then spread out per team.
  // and the remaining cards will be anything after n index (n = maxCards * team.length)
  let remainingCards = [...cards];
  let teamCardInfo = {};
  for (let i = 0; i < 10; i++) {
    remainingCards = shuffledCards(remainingCards);
  }

  // assign the cards to each team
  let index = 0;
  for (let teamId of teamIdList) {
    let activeCards = [];
    for (let i = 0; i < config.maxCard; i++) {
      let card = remainingCards[index];
      card.setActivator(teamId);
      activeCards.push(card);
      index++;
    }

    teamCardInfo = {
      ...teamCardInfo,
      [teamId]: {
        activeCards: activeCards.map((c) => c.getCardDetails()),
        usedCards: [],
      },
    };
  }

  // remove that from the cards list
  let newRemainingCards = remainingCards.slice(index);

  // return {remainingCards, teamCards}
  return {
    remainingCards: newRemainingCards.map((c) => c.getCardDetails()),
    teamCardInfo,
  };
};

/**
 *
 * @param {Array} cards
 * @returns {Array}
 */
const shuffledCards = (cards) => {
  return cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

module.exports = { createCards, dealCardsForTeam };
