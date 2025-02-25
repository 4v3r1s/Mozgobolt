const Rendeles = require("../model/rendeles");

// Get all rendelesek
exports.getAllRendeles = async (req, res) => {
  try {
    const rendelesek = await Rendeles.findAll();
    res.json(rendelesek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a rendeles by ID
exports.getRendelesById = async (req, res) => {
  try {
    const rendeles = await Rendeles.findByPk(req.params.id);
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    res.json(rendeles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new rendeles
exports.createRendeles = async (req, res) => {
  try {
    const newRendeles = await Rendeles.create(req.body);
    res.status(201).json(newRendeles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing rendeles
exports.updateRendeles = async (req, res) => {
  try {
    const rendeles = await Rendeles.findByPk(req.params.id);
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    await rendeles.update(req.body);
    res.json(rendeles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a rendeles
exports.deleteRendeles = async (req, res) => {
  try {
    const rendeles = await Rendeles.findByPk(req.params.id);
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    await rendeles.destroy();
    res.json({ message: "Rendeles deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
