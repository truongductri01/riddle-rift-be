let roundStages = require("../helpers/roundStages");

/**
 * @typedef CurrentRound
 * @property {Object} cardsToUsed
 * @property {roundStages} stage
 * @property {string} attackedTeamId
 * @property {string} targetTeamId
 */

// Card Info type def ------
/**
 * @typedef CardDataFireStore
 * @property {Array<Card>} remainingCards
 * @property {Object<string, TeamCardInfoValue>} teamCardInfo
 */

/**
 * @typedef Team
 * @property {number} healthPoint
 * @property {string} id
 * @property {string} leader
 * @property {string} name
 * @property {Array<string>} players
 */

/**
 * @typedef TeamCardInfoValue
 * @property {Array<Card>} activeCards
 * @property {Array<Card>} usedCards
 */

/**
 * @typedef Card
 * @property {string} id
 * @property {string} type
 * // add more details later
 */
