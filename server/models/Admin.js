const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcrypt");

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    accountLocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (admin) => {
        if (admin.password) {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      },
      beforeUpdate: async (admin) => {
        if (admin.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          admin.password = await bcrypt.hash(admin.password, salt);
        }
      },
    },
  }
);

// Méthode pour vérifier le mot de passe
Admin.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Admin;
