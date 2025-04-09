const Csoport = require("../model/csoport");
const { Sequelize } = require("sequelize");
const sequelize = require("../config/config");


exports.getAllCsoport = async (req, res) => {
  try {
    const csoportok = await Csoport.findAll();
    res.json(csoportok);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getCsoportById = async (req, res) => {
  try {
    const csoport = await Csoport.findByPk(req.params.id);
    if (!csoport) {
      return res.status(404).json({ message: "Csoport not found" });
    }
    res.json(csoport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.createCsoport = async (req, res) => {
  try {
    const newCsoport = await Csoport.create(req.body);
    res.status(201).json(newCsoport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateCsoport = async (req, res) => {
  try {
    const csoport = await Csoport.findByPk(req.params.id);
    if (!csoport) {
      return res.status(404).json({ message: "Csoport not found" });
    }
    await csoport.update(req.body);
    res.json(csoport);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteCsoport = async (req, res) => {
  try {
    const csoport = await Csoport.findByPk(req.params.id);
    if (!csoport) {
      return res.status(404).json({ message: "Csoport not found" });
    }
    await csoport.destroy();
    res.json({ message: "Csoport deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getAllCsoportWithCounts = async (req, res) => {
  try {
    const csoportokWithCounts = await Csoport.findAll({
      attributes: [
        'azonosito',
        'nev',
        'csoport',
        'hivatkozas',
        'tizennyolc',
        [sequelize.literal('(SELECT COUNT(*) FROM termek WHERE termek.csoport = Csoport.csoport)'), 'termekCount']
      ],
      order: [['nev', 'ASC']]
    });
    
    res.json(csoportokWithCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
