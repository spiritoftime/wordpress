"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("session_speakers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      speaker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },
      },
      topic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "topics",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("session_speakers");
  },
};
