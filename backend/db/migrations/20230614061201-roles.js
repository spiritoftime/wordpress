"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
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
    await queryInterface.dropTable("roles");
  },
};
