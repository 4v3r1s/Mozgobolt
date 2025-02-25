const Vevo = require("../model/vevo");

// Get all vevok
exports.getAllVevo = async (req, res) => {
  try {
    const vevok = await Vevo.findAll();
    res.json(vevok);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a vevo by ID
exports.getVevoById = async (req, res) => {
  try {
    const vevo = await Vevo.findByPk(req.params.id);
    if (!vevo) {
      return res.status(404).json({ message: "Vevo not found" });
    }
    res.json(vevo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new vevo
exports.createVevo = async (req, res) => {
  try {
    const newVevo = await Vevo.create(req.body);
    res.status(201).json(newVevo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing vevo
exports.updateVevo = async (req, res) => {
  try {
    const vevo = await Vevo.findByPk(req.params.id);
    if (!vevo) {
      return res.status(404).json({ message: "Vevo not found" });
    }
    await vevo.update(req.body);
    res.json(vevo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a vevo
exports.deleteVevo = async (req, res) => {
  try {
    const vevo = await Vevo.findByPk(req.params.id);
    if (!vevo) {
      return res.status(404).json({ message: "Vevo not found" });
    }
    await vevo.destroy();
    res.json({ message: "Vevo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
