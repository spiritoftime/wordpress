const { sequelize, DataTypes } = require("sequelize");
function initSession(sequelize) {
  const Session = sequelize.define(
    "Session",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      synopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      conferenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "conferences",
          key: "id",
        },        onDelete: "CASCADE",
      },
      sessionCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discussionDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      presentationDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sessionType: {
        type: DataTypes.ENUM("Symposia", "Masterclass"),
        allowNull: false,
        defaultValue: "Symposia",
      },
      wordpressUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wordpressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "rooms",
          key: "id",
        },        onDelete: "CASCADE",
      },
    },
    { underscored: true, timestamps: false }
  );
  return Session;
}
module.exports = initSession;
