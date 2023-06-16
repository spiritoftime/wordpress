const { sequelize, DataTypes } = require("sequelize");
function initTopicSpeaker(sequelize) {
  const TopicSpeaker = sequelize.define(
    "TopicSpeaker",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      speakerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "speakers",
          key: "id",
        },
      },
      topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "topics",
          key: "id",
        },
      },
    },
    { underscored: true, timestamps: false }
  );
  return TopicSpeaker;
}
module.exports = initTopicSpeaker;
