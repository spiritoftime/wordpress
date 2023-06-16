"use strict";
// sample
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("conferences", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      venue: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      wordpress_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("conferences");
  },
};
