"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("conference_speakers", [
      {
        conferenceId: 1,
        speakerId: 1,
        speakerPostId,
      },
      {
        first_name: "Harrison",
        last_name: "Moris",
        country: "Bhutan",
        title: "Manager",
        email: "Harrison@gmail.com",
        organisation: "KFC",
        biography: "KFC is a company that sells KFC",
        photoUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww",
        wordpressId: "abc",
        isAdmin: true,
      },
      {
        first_name: "Bob",
        last_name: "Ng",
        country: "Malaysia",
        title: "Assistant Manager",
        email: "Bob@gmail.com",
        organisation: "Macs",
        biography: "Macs is a company that sells Macs",
        photoUrl: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww",
        wordpressId: "abc",
        isAdmin: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conference_speakers", null, {});
  },
};
