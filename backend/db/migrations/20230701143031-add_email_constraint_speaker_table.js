"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("speakers", {
      fields: ["email"],
      type: "unique",
      name: "unique_speakers_email",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("speakers", "unique_speakers_email");
  },
};
