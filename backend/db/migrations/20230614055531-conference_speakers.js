"use strict";
// sample
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conference_speakers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      conference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "conferences",
          key: "id",
        },        onDelete: "CASCADE",
      },
      speaker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },        onDelete: "CASCADE",
      },
      speaker_post_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      speaker_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("conference_speakers");
  },
};
