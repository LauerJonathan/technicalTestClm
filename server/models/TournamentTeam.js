const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TournamentTeam = sequelize.define(
  "TournamentTeam",
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
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Teams",
        key: "id",
      },
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    matchesPlayed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    matchesWon: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    matchesDraw: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    matchesLost: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    goalsFor: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    goalsAgainst: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = TournamentTeam;
