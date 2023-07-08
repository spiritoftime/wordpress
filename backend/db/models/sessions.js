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
        type: DataTypes.DATE,
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
        },
      },
      sessionCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("Symopsia", "Masterclass"),
        allowNull: false,
        defaultValue: "Symposia",
      },
      wordpressUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "rooms",
          key: "id",
        },
      },
    },
    { underscored: true, timestamps: false }
  );
  return Session;
}
module.exports = initSession;
