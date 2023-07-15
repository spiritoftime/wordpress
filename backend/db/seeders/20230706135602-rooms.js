"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("rooms", [
      { room: "Room 1", conference_id: 1 },
      { room: "Room 2", conference_id: 1 },
      { room: "Room 3", conference_id: 1 },
      { room: "Hall A, Level 5, Suntec", conference_id: 2 },
      { room: "Hall B, Level 4, Suntec", conference_id: 3 },
      { room: "Room 2", conference_id: 3 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("rooms", null, {});
  },
};
