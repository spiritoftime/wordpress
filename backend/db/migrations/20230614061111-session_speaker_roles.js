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
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      session_speaker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "session_speakers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("session_speakers");
  },
};
