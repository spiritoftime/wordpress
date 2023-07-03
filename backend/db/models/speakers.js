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
      country: {
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
      organisation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wordpressId: {
        type: DataTypes.BIGINT,
      },
      biography: {
        type: DataTypes.TEXT,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Speaker;
}
module.exports = initSpeaker;
