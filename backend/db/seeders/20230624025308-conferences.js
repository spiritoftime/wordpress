"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("conferences", [
      {
        start_date: "2021-06-24",
        end_date: "2021-06-25",
        name: "APARCS 2022",
        country: "USA",
        venue: "New York",
        wordpressApi: "asdasd123123123",
      },
      {
        start_date: "2021-05-24",
        end_date: "2021-05-25",
        name: "APARCS 2021",
        country: "USA",
        venue: "New York",
        wordpressApi: "asdasd78678678",
      },
      {
        start_date: "2021-04-24",
        end_date: "2021-04-25",
        name: "APARCS 2020",
        country: "USA",
        venue: "Washington",
        wordpressApi: "asdasd9089018234",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conferences", null, {});
  },
};
