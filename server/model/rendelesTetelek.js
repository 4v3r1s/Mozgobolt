const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const RendelesTetelek = sequelize.define("RendelesTetelek", {
  azonosito: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  rendelesId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'rendeles',
      key: 'azonosito'
    }
  },
  termekId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: 'termek',
      key: 'azonosito'
    }
  },
  termekNev: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  mennyiseg: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  egysegAr: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  osszAr: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  }
}, {
  tableName: "rendeles_tetelek",
  timestamps: false,
});

module.exports = RendelesTetelek;
