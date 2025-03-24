const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const napi_fogyas = sequelize.define("napi_fogyas", {
  azonosito: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  raktar: { type: DataTypes.INTEGER, allowNull: false },
  termek: { type: DataTypes.TEXT, allowNull: false },
  mennyiseg: { type: DataTypes.INTEGER, allowNull: false },
  datum: { type: DataTypes.DATEONLY, allowNull: false },
  helyszin: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "napi_fogyas",
  timestamps: false,
});

// Instead, handle the association in your application logic
// You won't have foreign key constraints at the database level
// Kapcsolatok definiálása
napi_fogyas.associate = function(models) {
  napi_fogyas.belongsTo(models.Raktar, {
    foreignKey: 'raktar',
    targetKey: 'azonosito'
  });
  
  napi_fogyas.belongsTo(models.Termek, {
    foreignKey: 'termek',
    targetKey: 'azonosito'
  });
};

module.exports = napi_fogyas;
