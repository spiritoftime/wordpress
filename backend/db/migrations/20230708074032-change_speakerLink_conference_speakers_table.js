"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("conference_speakers", "speaker_link", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("conference_speakers", "speaker_link", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
