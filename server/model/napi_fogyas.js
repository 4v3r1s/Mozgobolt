const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Termek = require("./termek");
const Raktar = require("./raktar");

const napi_fogyas = sequelize.define("napi_fogyas", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  raktar: { type: DataTypes.INTEGER, allowNull: false },
  termek: { type: DataTypes.INTEGER, allowNull: false },
  mennyiseg: { type: DataTypes.INTEGER, allowNull: false },
  datum: { type: DataTypes.DATEONLY, allowNull: false },
  helyszin: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: "napi_fogyas",
  timestamps: false,
});


napi_fogyas.belongsTo(Raktar, {
  foreignKey: 'raktar',
  targetKey: 'azonosito',
  as: 'raktarData'
});

napi_fogyas.belongsTo(Termek, {
  foreignKey: 'termek',
  targetKey: 'azonosito',
  as: 'termekData'
});

module.exports = napi_fogyas;