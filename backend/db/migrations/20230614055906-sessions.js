"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      synopsis: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      conference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "conferences",
          key: "id",
        },
      },

      session_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discussion_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      presentation_duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      session_type: {
        type: Sequelize.ENUM("Symposia", "Masterclass"),
        allowNull: false,
        defaultValue: "Symposia",
      },
      wordpress_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      wordpress_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "rooms",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sessions");
  },
};
