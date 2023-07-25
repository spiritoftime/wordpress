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
        },        onDelete: "CASCADE",
      },
      speakerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },        onDelete: "CASCADE",
      },
      role: {
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
  return SessionSpeaker;
}
module.exports = initSessionSpeaker;
