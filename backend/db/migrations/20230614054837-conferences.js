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
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
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
      wordpress_api: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      wordpress_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      wordpress_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("conferences");
  },
};
