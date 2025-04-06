const RaktarKeszlet = require("../model/raktarKeszlet");
const Termek = require("../model/termek");
const Raktar = require("../model/raktar");
const { Op } = require("sequelize");

// Get all raktar keszlet
exports.getAllRaktarKeszlet = async (req, res) => {
  try {
    const keszletek = await RaktarKeszlet.findAll({
      include: [
        {
          model: Termek,
          as: 'termek',
          attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
        },
        {
          model: Raktar,
          as: 'raktar',
          attributes: ['azonosito', 'rendszam', 'max_kapacitas']
        }
      ]
    });
    res.json(keszletek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get keszlet by ID
exports.getRaktarKeszletById = async (req, res) => {
  try {
    const keszlet = await RaktarKeszlet.findByPk(req.params.id, {
      include: [
        {
          model: Termek,
          as: 'termek',
          attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
        },
        {
          model: Raktar,
          as: 'raktar',
          attributes: ['azonosito', 'rendszam', 'max_kapacitas']
        }
      ]
    });
    
    if (!keszlet) {
      return res.status(404).json({ message: "Keszlet not found" });
    }
    
    res.json(keszlet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get keszlet by raktar ID
exports.getKeszletByRaktarId = async (req, res) => {
  try {
    const keszletek = await RaktarKeszlet.findAll({
      where: { raktarId: req.params.raktarId },
      include: [
        {
          model: Termek,
          as: 'termek',
          attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
        },
        {
          model: Raktar,
          as: 'raktar',
          attributes: ['azonosito', 'rendszam', 'max_kapacitas']
        }
      ]
    });
    
    res.json(keszletek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get keszlet by termek ID
exports.getKeszletByTermekId = async (req, res) => {
  try {
    const keszletek = await RaktarKeszlet.findAll({
      where: { termekId: req.params.termekId },
      include: [
        {
          model: Termek,
          as: 'termek',
          attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
        },
        {
          model: Raktar,
          as: 'raktar',
          attributes: ['azonosito', 'rendszam', 'max_kapacitas']
        }
      ]
    });
    
    res.json(keszletek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new keszlet
exports.createRaktarKeszlet = async (req, res) => {
  try {
    // Ellenőrizzük, hogy létezik-e már ilyen raktarId-termekId kombináció
    const existing = await RaktarKeszlet.findOne({
      where: {
        raktarId: req.body.raktarId,
        termekId: req.body.termekId
      }
    });

    if (existing) {
      return res.status(400).json({ 
        message: "Ez a termék már szerepel ezen a mozgóbolton",
        existing
      });
    }

    // Ellenőrizzük, hogy létezik-e a raktar és a termek
    const raktar = await Raktar.findByPk(req.body.raktarId);
    if (!raktar) {
      return res.status(404).json({ message: "Raktar not found" });
    }

    const termek = await Termek.findByPk(req.body.termekId);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }

    // Ellenőrizzük, hogy a mozgóbolt kapacitása elegendő-e
    const osszKeszlet = await RaktarKeszlet.sum('keszlet', {
      where: { raktarId: req.body.raktarId }
    }) || 0;
    
    if (osszKeszlet + req.body.keszlet > raktar.max_kapacitas) {
      return res.status(400).json({ 
        message: "A mozgóbolt kapacitása nem elegendő",
        currentCapacity: osszKeszlet,
        maxCapacity: raktar.max_kapacitas,
        requested: req.body.keszlet
      });
    }

    const newKeszlet = await RaktarKeszlet.create({
      ...req.body,
      utolso_frissites: new Date()
    });
    
    // Lekérjük a kapcsolódó adatokkal együtt
    const keszletWithRelations = await RaktarKeszlet.findByPk(newKeszlet.azonosito, {
      include: [
        {
          model: Termek,
          as: 'termek',
          attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
        },
        {
          model: Raktar,
          as: 'raktar',
          attributes: ['azonosito', 'rendszam', 'max_kapacitas']
        }
      ]
    });
    
    res.status(201).json(keszletWithRelations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing keszlet
exports.updateRaktarKeszlet = async (req, res) => {
  try {
    const keszlet = await RaktarKeszlet.findByPk(req.params.id);
    if (!keszlet) {
      return res.status(404).json({ message: "Keszlet not found" });
    }

    // Ha változik a raktarId vagy termekId, ellenőrizzük, hogy nem ütközik-e
    if ((req.body.raktarId && req.body.raktarId !== keszlet.raktarId) || 
        (req.body.termekId && req.body.termekId !== keszlet.termekId)) {
      
      const existing = await RaktarKeszlet.findOne({
        where: {
          raktarId: req.body.raktarId || keszlet.raktarId,
          termekId: req.body.termekId || keszlet.termekId,
          azonosito: { [Op.ne]: keszlet.azonosito } // Ne találja meg önmagát
        }
      });

      if (existing) {
        return res.status(400).json({ 
          message: "Ez a termék már szerepel ezen a mozgóbolton",
          existing
        });
      }
    }

    // Ha változik a készlet mennyisége, ellenőrizzük a kapacitást
    if (req.body.keszlet && req.body.keszlet !== keszlet.keszlet) {
      const raktar = await Raktar.findByPk(req.body.raktarId || keszlet.raktarId);
      if (!raktar) {
        return res.status(404).json({ message: "Raktar not found" });
      }

      // Összegezzük a többi termék készletét
      const osszKeszlet = await RaktarKeszlet.sum('keszlet', {
        where: { 
          raktarId: req.body.raktarId || keszlet.raktarId,
          azonosito: { [Op.ne]: keszlet.azonosito } // Ne számoljuk bele önmagát
        }
      }) || 0;
      
      if (osszKeszlet + req.body.keszlet > raktar.max_kapacitas) {
        return res.status(400).json({ 
          message: "A mozgóbolt kapacitása nem elegendő",
          currentCapacity: osszKeszlet,
          maxCapacity: raktar.max_kapacitas,
          requested: req.body.keszlet
        });
      }
    }

    await keszlet.update({
      ...req.body,
      utolso_frissites: new Date()
    });
    
    // Lekérjük a kapcsolódó adatokkal együtt
    const updatedKeszlet = await RaktarKeszlet.findByPk(keszlet.azonosito, {
      include: [
        {
          model: Termek,
          as: 'termek',
          attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
        },
        {
          model: Raktar,
          as: 'raktar',
          attributes: ['azonosito', 'rendszam', 'max_kapacitas']
        }
      ]
    });
    
    res.json(updatedKeszlet);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a keszlet
exports.deleteRaktarKeszlet = async (req, res) => {
  try {
    const keszlet = await RaktarKeszlet.findByPk(req.params.id);
    if (!keszlet) {
      return res.status(404).json({ message: "Keszlet not found" });
    }
    await keszlet.destroy();
    res.json({ message: "Keszlet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update keszlet only
exports.updateKeszletOnly = async (req, res) => {
  try {
    const { id } = req.params;
    const { keszlet, megjegyzes } = req.body;
    
    if (keszlet === undefined) {
      return res.status(400).json({ message: "Keszlet value is required" });
    }
    
    const raktarKeszlet = await RaktarKeszlet.findByPk(id);
    if (!raktarKeszlet) {
      return res.status(404).json({ message: "Keszlet not found" });
    }
    
        // Ellenőrizzük a kapacitást
        const raktar = await Raktar.findByPk(raktarKeszlet.raktarId);
        if (!raktar) {
          return res.status(404).json({ message: "Raktar not found" });
        }
    
        // Összegezzük a többi termék készletét
        const osszKeszlet = await RaktarKeszlet.sum('keszlet', {
          where: { 
            raktarId: raktarKeszlet.raktarId,
            azonosito: { [Op.ne]: raktarKeszlet.azonosito } // Ne számoljuk bele önmagát
          }
        }) || 0;
        
        if (osszKeszlet + keszlet > raktar.max_kapacitas) {
          return res.status(400).json({ 
            message: "A mozgóbolt kapacitása nem elegendő",
            currentCapacity: osszKeszlet,
            maxCapacity: raktar.max_kapacitas,
            requested: keszlet
          });
        }
        
        await raktarKeszlet.update({
          keszlet,
          megjegyzes: megjegyzes !== undefined ? megjegyzes : raktarKeszlet.megjegyzes,
          utolso_frissites: new Date()
        });
        
        // Lekérjük a kapcsolódó adatokkal együtt
        const updatedKeszlet = await RaktarKeszlet.findByPk(id, {
          include: [
            {
              model: Termek,
              as: 'termek',
              attributes: ['azonosito', 'nev', 'vonalkod', 'egysegnyiar', 'kiszereles']
            },
            {
              model: Raktar,
              as: 'raktar',
              attributes: ['azonosito', 'rendszam', 'max_kapacitas']
            }
          ]
        });
        
        res.json(updatedKeszlet);
      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    };
    