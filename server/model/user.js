const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    jelszo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    felhasznalonev: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefonszam: {
        type: DataTypes.STRING,
    },
    vezeteknev: {
        type: DataTypes.STRING,
    },
    keresztnev: {
        type: DataTypes.STRING,
    },
    szuletesidatum: {
        type: DataTypes.DATE,
    },
    szerep: {
        type: DataTypes.ENUM("admin", "user", "vevo"),
        allowNull: false,
        defaultValue: "user",
    },
    szamlazasi_nev: {
        type: DataTypes.STRING(50),
    },
    szamlazasi_irsz: {
        type: DataTypes.INTEGER,
    },
    szamlazasi_telepules: {
        type: DataTypes.STRING(50),
    },
    szamlazasi_kozterulet: {
        type: DataTypes.STRING(50),
    },
    szamlazasi_hazszam: {
        type: DataTypes.STRING(5),
    },
    adoszam: {
        type: DataTypes.STRING(5),
    },
    szallitasi_nev: {
        type: DataTypes.STRING(50),
    },
    szallitasi_irsz: {
        type: DataTypes.INTEGER,
    },
    szallitasi_telepules: {
        type: DataTypes.STRING(50),
    },
    szallitasi_kozterulet: {
        type: DataTypes.STRING(50),
    },
    szallitasi_hazszam: {
        type: DataTypes.STRING(50),
    },
    hirlevel: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: "users", // Specify the exact table name in the database
    timestamps: true,
});

// Associations remain the same
User.associate = function(models) {
    User.hasMany(models.Rendeles, {
        foreignKey: 'vevo',
        sourceKey: 'id'
    });
};

sequelize.sync()
    .then(() => console.log("✅ User table updated!"))
    .catch(err => console.error("❌ Error updating User table:", err));

module.exports = User;module.exports = User;