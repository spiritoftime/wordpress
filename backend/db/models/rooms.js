const { sequelize, DataTypes } = require("sequelize");
function initRoom(sequelize) {
  const Room = sequelize.define(
    "Room",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Room;
}
module.exports = initRoom;
