const Raktar = require("../model/raktar");

// Get all raktar
exports.getAllRaktar = async (req, res) => {
  try {
    const raktarak = await Raktar.findAll();
    res.json(raktarak);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a raktar by ID
exports.getRaktarById = async (req, res) => {
  try {
    const raktar = await Raktar.findByPk(req.params.id);
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }
    res.json(raktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new raktar
exports.createRaktar = async (req, res) => {
  try {
    const newRaktar = await Raktar.create(req.body);
    res.status(201).json(newRaktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing raktar
exports.updateRaktar = async (req, res) => {
  try {
    const raktar = await Raktar.findByPk(req.params.id);
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }
    await raktar.update(req.body);
    res.json(raktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a raktar
exports.deleteRaktar = async (req, res) => {
  try {
    const raktar = await Raktar.findByPk(req.params.id);
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }
    await raktar.destroy();
    res.json({ message: "Raktar deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
