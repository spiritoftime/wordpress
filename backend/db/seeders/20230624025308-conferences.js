"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("conferences", [
      {
        start_date: "2023-07-22",
        end_date: "2023-07-24",
        name: "APARCS 2023",
        country: "Bhutan",
        venue: "Bhutan Convention Centre",
        wordpress_api: "https://hweitian.com",
      },
      {
        start_date: "2022-07-24",
        end_date: "2022-07-26",
        name: "APARCS 2022",
        country: "Brunei",
        venue: "Brunei Convention Centre",
        wordpress_api: "asdasd78678678",
      },
      {
        start_date: "2021-06-24",
        end_date: "2021-06-26",
        name: "APARCS 2021",
        country: "Cambodia",
        venue: "Cambodia Convention Center",
        wordpress_api: "asdasd9089018234",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conferences", null, {});
  },
};
