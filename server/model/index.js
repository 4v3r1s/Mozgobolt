const User = require('./user');
const Rendeles = require('./rendeles');
const Termek = require('./termek');
const Csoport = require('./csoport');
const Raktar = require('./raktar');
const napi_fogyas = require('./napi_fogyas');


const models = {
  User,
  Rendeles,
  Termek,
  Csoport,
  Raktar,
  napi_fogyas
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
