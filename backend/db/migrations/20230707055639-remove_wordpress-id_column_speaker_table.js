"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("speakers", "wordpress_id", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("speakers", "wordpress_id", {
      type: Sequelize.BIGINT,
    });
  },
};
