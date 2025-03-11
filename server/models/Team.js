const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player1Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player2Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Team;
