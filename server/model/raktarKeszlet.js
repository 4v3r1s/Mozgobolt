const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Termek = require("./termek");
const Raktar = require("./raktar");

const RaktarKeszlet = sequelize.define("RaktarKeszlet", {
  termekId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'termek',
      key: 'azonosito'
    },
    comment: "A termék azonosítója a termek táblából" 
  },
  keszlet: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 0,
    comment: "Az adott mozgóbolton lévő készlet mennyisége" 
  },
  utolso_frissites: { 
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: "A készlet utolsó frissítésének időpontja" 
  },
  megjegyzes: { 
    type: DataTypes.TEXT, 
    allowNull: true,
    comment: "Opcionális megjegyzés a készlettel kapcsolatban" 
  }
}, {
  tableName: "raktar_keszlet",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['raktarId', 'termekId'],
      name: 'raktar_keszlet_unique'
    }
  ]
});


RaktarKeszlet.belongsTo(Raktar, {
  foreignKey: 'raktarId',
  targetKey: 'azonosito',
  as: 'raktar'
});

RaktarKeszlet.belongsTo(Termek, {
  foreignKey: 'termekId',
  targetKey: 'azonosito',
  as: 'termek'
});


Raktar.hasMany(RaktarKeszlet, {
  foreignKey: 'raktarId',
  sourceKey: 'azonosito',
  as: 'keszletek'
});

Termek.hasMany(RaktarKeszlet, {
  foreignKey: 'termekId',
  sourceKey: 'azonosito',
  as: 'raktarkeszletek'
});

module.exports = RaktarKeszlet;
