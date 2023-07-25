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
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "sessions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      speaker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM,
        values: [
          "Course Director",
          "Co-Course Director",
          "Chair",
          "Co-Chair",
          "Moderator",
          "Judge",
          "Chief Judge",
          "Faculty",
          "Speaker",
        ],
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("session_speakers");
  },
};
