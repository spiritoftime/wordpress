const { sequelize, DataTypes } = require("sequelize");
function initConferenceSpeaker(sequelize) {
  const ConferenceSpeaker = sequelize.define(
    "ConferenceSpeaker",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      speakerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      speakerPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      speakerLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true, timestamps: false }
  );
  return ConferenceSpeaker;
}
module.exports = initConferenceSpeaker;
