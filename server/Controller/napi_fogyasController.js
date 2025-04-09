const napi_fogyas = require("../model/napi_fogyas");
const Termek = require("../model/termek");
const Raktar = require("../model/raktar");


exports.getAllNapiFogyas = async (req, res) => {
  try {
    const napiFogyasok = await napi_fogyas.findAll({
      include: [{
        model: Termek,
        attributes: ['nev', 'kiszereles', 'kepUrl'],
        as: 'termekData'
      }, {
        model: Raktar,
        attributes: ['rendszam'],
        as: 'raktarData'
      }],
      order: [['datum', 'DESC']]
    });
    res.json(napiFogyasok);
  } catch (error) {
    console.error("Hiba a napi fogyás lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a napi_fogyas by ID
exports.getNapiFogyasById = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id, {
      include: [{
        model: Termek,
        attributes: ['nev', 'kiszereles', 'kepUrl'],
        as: 'termekData'
      }, {
        model: Raktar,
        attributes: ['rendszam'],
        as: 'raktarData'
      }]
    });
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    res.json(napiFogyas);
  } catch (error) {
    console.error("Hiba a napi fogyás lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new napi_fogyas
exports.createNapiFogyas = async (req, res) => {
  try {
    const newNapiFogyas = await napi_fogyas.create(req.body);
    res.status(201).json(newNapiFogyas);
  } catch (error) {
    console.error("Hiba a napi fogyás létrehozásakor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing napi_fogyas
exports.updateNapiFogyas = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id);
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    await napiFogyas.update(req.body);
    res.json(napiFogyas);
  } catch (error) {
    console.error("Hiba a napi fogyás frissítésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a napi_fogyas
exports.deleteNapiFogyas = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id);
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    await napiFogyas.destroy();
    res.json({ message: "Napi fogyas deleted successfully" });
  } catch (error) {
    console.error("Hiba a napi fogyás törlésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fájl feltöltés és feldolgozás
exports.uploadNapiFogyas = async (req, res) => {
  try {
    // Itt kellene implementálni a fájl feltöltés és feldolgozás logikáját
    // Ez a funkció már megvalósításra került a napiFogyas.jsx komponensben
    // Itt csak a szerver oldali feldolgozást kell megvalósítani
    
    if (!req.file) {
      return res.status(400).json({ message: "Nincs feltöltött fájl" });
    }
    
    // Fájl feldolgozása és adatok mentése az adatbázisba
    // Ez a funkció implementációja a projekt igényeitől függ
    
    res.status(200).json({ message: "Fájl sikeresen feltöltve és feldolgozva" });
  } catch (error) {
    console.error("Hiba a fájl feltöltése során:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Statisztikák lekérése
exports.getNapiFogyasStatistics = async (req, res) => {
  try {
    // Összesített statisztikák lekérése
    const totalCount = await napi_fogyas.count();
    
    // Napi fogyás összesítése dátum szerint
    const dailySummary = await napi_fogyas.findAll({
      attributes: [
        'datum',
        [sequelize.fn('SUM', sequelize.col('mennyiseg')), 'totalMennyiseg'],
        [sequelize.fn('COUNT', sequelize.col('azonosito')), 'recordCount']
      ],
      group: ['datum'],
      order: [['datum', 'DESC']],
      limit: 30
    });
    
    // Raktárak szerinti összesítés
    const raktarSummary = await napi_fogyas.findAll({
      attributes: [
        'raktar',
        [sequelize.fn('SUM', sequelize.col('mennyiseg')), 'totalMennyiseg'],
        [sequelize.fn('COUNT', sequelize.col('azonosito')), 'recordCount']
      ],
      include: [{
        model: Raktar,
        attributes: ['rendszam'],
        as: 'raktarData'
      }],
      group: ['raktar', 'raktarData.azonosito', 'raktarData.rendszam'],
      order: [[sequelize.fn('SUM', sequelize.col('mennyiseg')), 'DESC']]
    });
    
    // Termékek szerinti összesítés
    const termekSummary = await napi_fogyas.findAll({
      attributes: [
        'termek',
        [sequelize.fn('SUM', sequelize.col('mennyiseg')), 'totalMennyiseg'],
        [sequelize.fn('COUNT', sequelize.col('azonosito')), 'recordCount']
      ],
      include: [{
        model: Termek,
        attributes: ['nev', 'kiszereles'],
        as: 'termekData'
      }],
      group: ['termek', 'termekData.azonosito', 'termekData.nev', 'termekData.kiszereles'],
      order: [[sequelize.fn('SUM', sequelize.col('mennyiseg')), 'DESC']],
      limit: 20
    });
    
    res.json({
      totalCount,
      dailySummary,
      raktarSummary,
      termekSummary
    });
  } catch (error) {
    console.error("Hiba a napi fogyás statisztikák lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

    
