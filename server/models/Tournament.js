const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Tournament = sequelize.define(
  "Tournament",
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "open", "in_progress", "completed"),
      defaultValue: "draft",
    },
    createdById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Admins",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Tournament;
