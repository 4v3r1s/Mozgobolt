const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Vevo = sequelize.define("Vevo", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nev: { type: DataTypes.STRING(50), allowNull: false },
  keresztnev: { type: DataTypes.STRING(50), allowNull: false },
  telefonszam: { type: DataTypes.STRING(50), allowNull: false },
  email: { type: DataTypes.STRING(50), allowNull: false },
  jelszo: { type: DataTypes.STRING(15), allowNull: false },
  szuletesidatum: { type: DataTypes.DATEONLY, allowNull: false },
  irsz: { type: DataTypes.INTEGER, allowNull: false },
  telepules: { type: DataTypes.STRING(50), allowNull: false },
  kozterulet: { type: DataTypes.STRING(50), allowNull: false },
  hazszam: { type: DataTypes.STRING(50), allowNull: false },
  egyeb: { type: DataTypes.STRING(50), allowNull: false },
  szamlazasi_nev: { type: DataTypes.STRING(50), allowNull: false },
  szamlazasi_irsz: { type: DataTypes.INTEGER, allowNull: false },
  szamlazasi_telepules: { type: DataTypes.STRING(50), allowNull: false },
  szamlazasi_kozterulet: { type: DataTypes.STRING(50), allowNull: false },
  szamlazasi_hazszam: { type: DataTypes.STRING(5), allowNull: false },
  szamlazasi_egyeb: { type: DataTypes.STRING(50), allowNull: false },
  adoszam: { type: DataTypes.STRING(5), allowNull: false },
  szallitasi_nev: { type: DataTypes.STRING(50), allowNull: false },
  szallitasi_irsz: { type: DataTypes.INTEGER, allowNull: false },
  szallitasi_telepules: { type: DataTypes.STRING(50), allowNull: false },
  szallitasi_kozterulet: { type: DataTypes.STRING(50), allowNull: false },
  szallitasi_hazszam: { type: DataTypes.STRING(50), allowNull: false },
  hirlevel: { type: DataTypes.STRING(5), allowNull: false },
}, {
  tableName: "vevo",
  timestamps: false,
});

module.exports = Vevo;
