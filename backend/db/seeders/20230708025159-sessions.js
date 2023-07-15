"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("sessions", [
      {
        title: "Session 1",
        synopsis: "Synopsis 1",
        date: "2021-07-08",
        start_time: "2021-07-08 09:00:00",
        end_time: "2021-07-08 10:00:00",
        conference_id: 1,
        session_code: "S1",
        session_type: "Symposia",
        wordpress_url: "https://wordpress.org/",
        room_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("sessions", null, {});
  },
};
