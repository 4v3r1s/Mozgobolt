const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Termek = sequelize.define("Termek", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nev: { type: DataTypes.STRING(255), allowNull: true },
  ar: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  egysegnyiar: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  csoport: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
    references: {
      model: 'csoport',
      key: 'azonosito'
    }
  },
  termekleiras: { type: DataTypes.TEXT, allowNull: true },
  kiszereles: { type: DataTypes.STRING(100), allowNull: true },
  keszlet: { type: DataTypes.INTEGER, allowNull: true },
  akciosar: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  akcios_egysegnyiar: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  akcio_vege: { type: DataTypes.DATEONLY, allowNull: true },
  akcio_eleje: { type: DataTypes.DATEONLY, allowNull: true },
  hivatkozas: { type: DataTypes.STRING(255), allowNull: true },
  ajanlott_termekek: { type: DataTypes.STRING(255), allowNull: true },
  tizennyolc: { type: DataTypes.BOOLEAN, allowNull: true },
  afa_kulcs: { type: DataTypes.STRING(50), allowNull: true },
  meret: { type: DataTypes.STRING(50), allowNull: true },
  szin: { type: DataTypes.STRING(50), allowNull: true },
  vonalkod: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "termek",
  timestamps: false,
});

Termek.associate = function(models) {
  Termek.hasMany(models.Rendeles, {
    foreignKey: 'termek',
    sourceKey: 'azonosito'
  });
  
  Termek.belongsTo(models.Csoport, {
    foreignKey: 'csoport',
    targetKey: 'azonosito'
  });
};

module.exports = Termek;