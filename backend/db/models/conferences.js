const { sequelize, DataTypes } = require("sequelize");
function initConference(sequelize) {
  const Conference = sequelize.define(
    "Conference",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      venue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      wordpressApi: {
        type: DataTypes.STRING,
      },
      wordpressId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      wordpressUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { underscored: true, timestamps: false }
  );
  return Conference;
}
module.exports = initConference;
