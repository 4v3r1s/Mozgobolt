const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Rendeles = sequelize.define("Rendeles", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vevo: { type: DataTypes.STRING(50), allowNull: false },
  termek: { type: DataTypes.STRING(50), allowNull: false },
  mennyiseg: { type: DataTypes.INTEGER, allowNull: false },
  datum: { type: DataTypes.DATEONLY, allowNull: false },
  helyszin: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "rendeles",
  timestamps: false,
});

module.exports = Rendeles;
