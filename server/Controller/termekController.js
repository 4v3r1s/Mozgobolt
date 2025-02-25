const Termek = require("../model/termek");

// Get all termekek
exports.getAllTermek = async (req, res) => {
  try {
    const termekek = await Termek.findAll();
    res.json(termekek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a termek by ID
exports.getTermekById = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    res.json(termek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new termek
exports.createTermek = async (req, res) => {
  try {
    const newTermek = await Termek.create(req.body);
    res.status(201).json(newTermek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing termek
exports.updateTermek = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    await termek.update(req.body);
    res.json(termek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a termek
exports.deleteTermek = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    await termek.destroy();
    res.json({ message: "Termek deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
