const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const RendelesTetelek = require('./rendelesTetelek');
const Rendeles = sequelize.define("Rendeles", {
  azonosito: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  
  rendelesAzonosito: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    unique: true
  },
 
  vevoNev: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  vevoEmail: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  vevoTelefon: { 
    type: DataTypes.STRING(50), 
    allowNull: false 
  },
  
  szallitasiCim: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  szallitasiVaros: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  szallitasiIrsz: { 
    type: DataTypes.STRING(20), 
    allowNull: false 
  },
 
  fizetesiMod: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    defaultValue: 'cash' 
  },
  
  allapot: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    defaultValue: 'feldolgozás alatt' 
  },

  osszeg: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  szallitasiDij: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    defaultValue: 0 
  },
  kedvezmeny: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false,
    defaultValue: 0 
  },
  vegosszeg: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },

  rendelesIdeje: { 
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: DataTypes.NOW 
  },

  felhasznaloId: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
}, {
  tableName: "rendeles",
  timestamps: false,
});

Rendeles.hasMany(RendelesTetelek, {
  foreignKey: 'rendelesId',
  sourceKey: 'azonosito',
  as: 'tetelek'
});

module.exports = Rendeles;
