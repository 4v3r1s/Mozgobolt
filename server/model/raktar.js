const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Raktar = sequelize.define("Raktar", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rendszam: { type: DataTypes.TEXT, allowNull: false },
  megjegyzes: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "raktar",
  timestamps: false,
});

module.exports = Raktar;
