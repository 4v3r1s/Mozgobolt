const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Csoport = sequelize.define("Csoport", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nev: { type: DataTypes.STRING(50), allowNull: false },
  csoport: { type: DataTypes.INTEGER, allowNull: false },
  hivatkozas: { type: DataTypes.STRING(150), allowNull: false },
  tizennyolc: { type: DataTypes.BOOLEAN, allowNull: true },
}, {
  tableName: "csoport",
  timestamps: false,
});

// Kapcsolatok definiálása
Csoport.associate = function(models) {
  Csoport.hasMany(models.Termek, {
    foreignKey: 'csoport',
    sourceKey: 'azonosito'
  });
};

module.exports = Csoport;
