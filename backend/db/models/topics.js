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
        allowNull: false,
        references: {
          model: "sessions",
          key: "id",
        },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Topic;
}
module.exports = initTopic;
