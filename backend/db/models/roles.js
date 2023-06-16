const { sequelize, DataTypes } = require("sequelize");
function initRole(sequelize) {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.ENUM,
        values: [
          "Course Director",
          "Co-Course Director",
          "Chair",
          "Co-Chair",
          "Moderator",
          "Judge",
          "Chief Judge",
          "Faculty",
          "Speaker",
        ],
        allowNull: false,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Role;
}
module.exports = initRole;
