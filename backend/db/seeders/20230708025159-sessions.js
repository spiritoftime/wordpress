"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("sessions", [
      {
        title: "Session 1",
        synopsis: "Synopsis 1",
        date: "2021-07-08",
        startTime: "2021-07-08 09:00:00",
        endTime: "2021-07-08 10:00:00",
        conferenceId: 1,
        sessionCode: "S1",
        type: "Symposia",
        wordpressUrl: "https://wordpress.org/",
        roomId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sessions", null, {});
  },
};
