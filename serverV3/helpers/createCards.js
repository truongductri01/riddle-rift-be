/**
 * @typedef {Object} Config
 * @property {Object} cardsAmountConfig
 * @property {Number} maxCard
 * @property {Array} teams
 * @property {Number} maxHealth
 */

/**
 * @param {Config} config
 * @returns {Array}
 */
const createCards = async (config) => {
  let cards = [];
  for (let cardType in config.cardsAmountConfig) {
    let amount = config.cardsAmountConfig[cardType];
    for (let i = 0; i < amount; i++) {
      cards.push({ type: cardType, id: Date.now().toString() });
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  return cards;
};

/**
 *
 * @param {Config} config
 * @param {Array} cards
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
      activeCards.push(remainingCards[index]);
      index++;
    }

    teamCardInfo = {
      ...teamCardInfo,
      [teamId]: { activeCards, usedCards: [] },
    };
  }

  // remove that from the cards list
  let newRemainingCards = remainingCards.slice(index);

  // return {remainingCards, teamCards}
  return { remainingCards: newRemainingCards, teamCardInfo };
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
