const Raktar = require("../model/raktar");


exports.getAllRaktar = async (req, res) => {
  try {
    const raktarak = await Raktar.findAll();
    res.json(raktarak);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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


exports.getRaktarByRendszam = async (req, res) => {
  try {
    const raktar = await Raktar.findOne({
      where: { rendszam: req.params.rendszam }
    });
    
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found with this rendszam" });
    }
    
    res.json(raktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.createRaktar = async (req, res) => {
  try {
    
    const existing = await Raktar.findOne({
      where: { rendszam: req.body.rendszam }
    });

    if (existing) {
      return res.status(400).json({ 
        message: "Már létezik mozgóbolt ezzel a rendszámmal",
        existing
      });
    }

    const newRaktar = await Raktar.create(req.body);
    res.status(201).json(newRaktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateRaktar = async (req, res) => {
  try {
    const raktar = await Raktar.findByPk(req.params.id);
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }

    
    if (req.body.rendszam && req.body.rendszam !== raktar.rendszam) {
      const existing = await Raktar.findOne({
        where: { rendszam: req.body.rendszam }
      });

      if (existing) {
        return res.status(400).json({ 
          message: "Már létezik mozgóbolt ezzel a rendszámmal",
          existing
        });
      }
    }

    await raktar.update(req.body);
    res.json(raktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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


exports.updateMaxKapacitas = async (req, res) => {
  try {
    const { id } = req.params;
    const { max_kapacitas } = req.body;
    
    if (!max_kapacitas || max_kapacitas <= 0) {
      return res.status(400).json({ message: "Invalid max_kapacitas value" });
    }
    
    const raktar = await Raktar.findByPk(id);
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }
    
    await raktar.update({ max_kapacitas });
    res.json(raktar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
