"use strict";
// sample
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("conferences", "wordpress_api", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn("conferences", "wordpress_url");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("conferences", "wordpress_api");
    await queryInterface.addColumn("conferences", "wordpress_url", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
