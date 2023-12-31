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
      room: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      conferenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "conferences",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    { underscored: true, timestamps: false }
  );
  return Room;
}
module.exports = initRoom;
