"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("conferences", [
      {
        start_date: "2021-06-24",
        end_date: "2021-06-25",
        name: "APARCS 2022",
        country:"USA",
        venue:"New York",
      },
      {

        start_date: "2021-05-24",
        end_date: "2021-05-25",
        name: "APARCS 2021",
        country:"USA",
        venue:"New York",

      },
      {

        start_date: "2021-04-24",
        end_date: "2021-04-25",
        name: "APARCS 2020",
        country:"USA",
        venue:"Washington",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conferences", null, {});
  },
};
