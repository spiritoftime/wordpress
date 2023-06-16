const { sequelize, DataTypes } = require("sequelize");
function initSessionSpeakerRole(sequelize) {
  const SessionSpeakerRole = sequelize.define(
    "SessionSpeakerRole",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      sessionSpeakerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "session_speakers",
          key: "id",
        },
      },
    },
    { underscored: true, timestamps: false }
  );
  return SessionSpeakerRole;
}
module.exports = initSessionSpeakerRole;
