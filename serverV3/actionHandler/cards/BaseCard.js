const actionGenerator = require("../actionGenerator");
const BaseAction = require("../actions/BaseAction");

class BaseCard {
  constructor(activator, cardId, targets) {
    if (this.constructor === BaseCard) {
      throw new Error("Abstract classes can't be instantiated.");
    }
    this.details = null;
    this.activator = activator;
    this.cardId = cardId;
    this.targets = targets ?? [];

    this.setCardDetails();

    // then call to validate details
    this.evaluateCardDetails();
  }

  // abstract method to set details
  setCardDetails() {
    throw new Error("Method `setCardDetails()` must be implemented");
  }

  /**
   * @returns {BaseAction}
   */
  toAction() {
    return actionGenerator(
      this.details.type,
      this.details,
      this.activator,
      this.targets
    );
  }

  getCardDetails() {
    return { ...this.details, targets: this.targets };
  }

  setActivator(activator) {
    this.activator = activator;
  }

  // evaluate the details
  evaluateCardDetails() {
    if (!this.details) {
      throw new Error("details must be set");
    }

    let expectedKeys = [
      "activation",
      "type",
      "id",
      "damage",
      "heal",
      "counteredBy",
      "description",
      "targetType",
      "cantExistWith",
    ];

    for (let key of expectedKeys) {
      if (!(key in this.details)) {
        throw new Error(`Missing '${key}' for the card details.`);
      }
    }
  }
}

module.exports = BaseCard;
