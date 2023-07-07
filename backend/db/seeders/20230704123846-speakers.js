"use strict";
// make your seeder file
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("speakers", [
      {
        first_name: "Harrison",
        last_name: "Moris",
        country: "Bhutan",
        title: "Manager",
        email: "Harrison@gmail.com",
        organisation: "KFC",
        biography: "KFC is a company that sells KFC",
        photo_url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww",
        wordpress_id: 123455,
        is_admin: true,
      },
      {
        first_name: "Bob",
        last_name: "Ng",
        country: "Malaysia",
        title: "Assistant Manager",
        email: "Bob@gmail.com",
        organisation: "Macs",
        biography: "Macs is a company that sells Macs",
        photo_url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww",
        wordpress_id: 123455,
        is_admin: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("speakers", null, {});
  },
};
