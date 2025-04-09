const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const Termek = require("./termek");
const Raktar = require("./raktar");

const RaktarKeszlet2 = sequelize.define("RaktarKeszlet2", {
  raktarId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'raktar',
      key: 'azonosito'
    },
    comment: "A mozgóbolt azonosítója a raktar táblából" 
  },
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
  tableName: "raktar_keszlet2",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['raktarId', 'termekId'],
      name: 'raktar_keszlet2_unique'
    }
  ]
});


RaktarKeszlet2.belongsTo(Raktar, {
  foreignKey: 'raktarId',
  targetKey: 'azonosito',
  as: 'raktar'
});

RaktarKeszlet2.belongsTo(Termek, {
  foreignKey: 'termekId',
  targetKey: 'azonosito',
  as: 'termek'
});


Raktar.hasMany(RaktarKeszlet2, {
  foreignKey: 'raktarId',
  sourceKey: 'azonosito',
  as: 'keszletek2'
});

Termek.hasMany(RaktarKeszlet2, {
  foreignKey: 'termekId',
  sourceKey: 'azonosito',
  as: 'raktarkeszletek2'
});

module.exports = RaktarKeszlet2;
