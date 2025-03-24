const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Rendeles = sequelize.define("Rendeles", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  vevo: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'users', // Match the tableName from the User model
      key: 'id'
    }
  },
  termek: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'termek',
      key: 'azonosito'
    }
  },
  mennyiseg: { type: DataTypes.INTEGER, allowNull: false },
  datum: { type: DataTypes.DATEONLY, allowNull: false },
  helyszin: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "rendeles",
  timestamps: false,
});

// Kapcsolatok definiálása
Rendeles.associate = function(models) {
  Rendeles.belongsTo(models.User, {
    foreignKey: 'vevo',
    targetKey: 'id'
  });
  
  Rendeles.belongsTo(models.Termek, {
    foreignKey: 'termek',
    targetKey: 'azonosito'
  });
};

module.exports = Rendeles;
