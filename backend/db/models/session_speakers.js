const { sequelize, DataTypes } = require("sequelize");
function initSessionSpeaker(sequelize) {
  const SessionSpeaker = sequelize.define(
    "SessionSpeaker",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "sessions",
          key: "id",
        },
      },
      speakerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },
      },
    },
    { underscored: true, timestamps: false }
  );
  return SessionSpeaker;
}
module.exports = initSessionSpeaker;
