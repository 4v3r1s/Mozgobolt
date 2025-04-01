const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");
const RendelesTetelek = require('./rendelesTetelek');
const Rendeles = sequelize.define("Rendeles", {
  azonosito: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  // Rendelés azonosító (pl. R-12345)
  rendelesAzonosito: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    unique: true
  },
  // Vevő adatok
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
  // Szállítási adatok
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
  // Fizetési adatok
  fizetesiMod: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    defaultValue: 'cash' 
  },
  // Rendelés állapota (pl. feldolgozás alatt, kiszállítva, stb.)
  allapot: { 
    type: DataTypes.STRING(50), 
    allowNull: false,
    defaultValue: 'feldolgozás alatt' 
  },
  // Rendelés összegzés
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
  // Időbélyegek
  rendelesIdeje: { 
    type: DataTypes.DATE, 
    allowNull: false,
    defaultValue: DataTypes.NOW 
  },
  // Opcionális felhasználói azonosító, ha be van jelentkezve
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
