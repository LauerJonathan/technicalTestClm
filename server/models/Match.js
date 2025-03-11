const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tournamentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tournaments",
        key: "id",
      },
    },
    homeTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Teams",
        key: "id",
      },
    },
    awayTeamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Teams",
        key: "id",
      },
    },
    homeScore: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    awayScore: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
      defaultValue: "scheduled",
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    playedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Match;
