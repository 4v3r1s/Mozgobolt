const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Raktar = sequelize.define("Raktar", {
  azonosito: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  rendszam: { 
    type: DataTypes.STRING(20), 
    allowNull: false,
    comment: "A mozgóbolt rendszáma" 
  },
  max_kapacitas: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 1000,
    comment: "A mozgóbolt maximális kapacitása" 
  },
  megjegyzes: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    comment: "Opcionális megjegyzés a mozgóbolttal kapcsolatban" 
  }
}, {
  tableName: "raktar",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['rendszam'],
      name: 'raktar_rendszam_unique'
    }
  ]
});

module.exports = Raktar;
