const { sequelize, DataTypes } = require("sequelize");
function initTopic(sequelize) {
  const Topic = sequelize.define(
    "Topic",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "sessions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      conferenceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "conferences",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Topic;
}
module.exports = initTopic;
