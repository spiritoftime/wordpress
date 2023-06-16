const { sequelize, DataTypes } = require("sequelize");
function initSpeaker(sequelize) {
  const Speaker = sequelize.define(
    "Speaker",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      wordpressId: {
        type: DataTypes.BIGINT,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Speaker;
}
module.exports = initSpeaker;
