const napi_fogyas = require("../model/napi_fogyas");

// Get all napi_fogyas
exports.getAllNapiFogyas = async (req, res) => {
  try {
    const napiFogyasok = await napi_fogyas.findAll();
    res.json(napiFogyasok);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a napi_fogyas by ID
exports.getNapiFogyasById = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id);
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    res.json(napiFogyas);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new napi_fogyas
exports.createNapiFogyas = async (req, res) => {
  try {
    const newNapiFogyas = await napi_fogyas.create(req.body);
    res.status(201).json(newNapiFogyas);
  } catch (error) {
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
