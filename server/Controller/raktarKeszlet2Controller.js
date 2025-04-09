
const RaktarKeszlet2 = require("../model/raktarKeszlet2");
const Termek = require("../model/termek");
const Raktar = require("../model/raktar");


exports.getAllRaktarKeszlet2 = async (req, res) => {
  try {
    const keszletek = await RaktarKeszlet2.findAll({
      include: [
        { model: Termek, as: 'termek' },
        { model: Raktar, as: 'raktar' }
      ]
    });
    res.json(keszletek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getByRaktarId = async (req, res) => {
  try {
    const keszletek = await RaktarKeszlet2.findAll({
      where: { raktarId: req.params.id },
      include: [
        { model: Termek, as: 'termek' },
        { model: Raktar, as: 'raktar' }
      ]
    });
    res.json(keszletek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getByTermekId = async (req, res) => {
  try {
    const keszletek = await RaktarKeszlet2.findAll({
      where: { termekId: req.params.id },
      include: [
        { model: Termek, as: 'termek' },
        { model: Raktar, as: 'raktar' }
      ]
    });
    res.json(keszletek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSpecificKeszlet = async (req, res) => {
  try {
    const keszlet = await RaktarKeszlet2.findOne({
      where: { 
        raktarId: req.params.raktarId,
        termekId: req.params.termekId
      },
      include: [
        { model: Termek, as: 'termek' },
        { model: Raktar, as: 'raktar' }
      ]
    });
    
    if (!keszlet) {
      return res.status(404).json({ message: "Készlet not found" });
    }
    
    res.json(keszlet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createRaktarKeszlet2 = async (req, res) => {
  try {
    
    const raktar = await Raktar.findByPk(req.body.raktarId);
    const termek = await Termek.findByPk(req.body.termekId);
    
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }
    
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    
    const newKeszlet = await RaktarKeszlet2.create(req.body);
    res.status(201).json(newKeszlet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateRaktarKeszlet2 = async (req, res) => {
  try {
    const keszlet = await RaktarKeszlet2.findOne({
      where: { 
        raktarId: req.params.raktarId,
        termekId: req.params.termekId
      }
    });
    
    if (!keszlet) {
      return res.status(404).json({ message: "Készlet not found" });
    }
    
    await keszlet.update(req.body);
    res.json(keszlet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.deleteRaktarKeszlet2 = async (req, res) => {
  try {
    const keszlet = await RaktarKeszlet2.findOne({
      where: { 
        raktarId: req.params.raktarId,
        termekId: req.params.termekId
      }
    });
    
    if (!keszlet) {
      return res.status(404).json({ message: "Készlet not found" });
    }
    
    await keszlet.destroy();
    res.json({ message: "Készlet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
