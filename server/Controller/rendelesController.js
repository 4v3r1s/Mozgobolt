const Rendeles = require("../model/rendeles");
const RendelesTetelek = require("../model/rendelesTetelek");
const Termek = require("../model/termek");
const sequelize = require("../config/config");

// Get all rendelesek
exports.getAllRendeles = async (req, res) => {
  try {
    const rendelesek = await Rendeles.findAll({
      order: [['rendelesIdeje', 'DESC']]
    });
    res.json(rendelesek);
  } catch (error) {
    console.error("Hiba a rendelések lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a rendeles by ID
exports.getRendelesById = async (req, res) => {
  try {
    const rendeles = await Rendeles.findByPk(req.params.id, {
      include: [{
        model: RendelesTetelek,
        include: [{
          model: Termek,
          attributes: ['nev', 'kepUrl']
        }]
      }]
    });
    
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    
    res.json(rendeles);
  } catch (error) {
    console.error("Hiba a rendelés lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new rendeles
exports.createRendeles = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      vevoAdatok, 
      szallitasiAdatok, 
      fizetesiMod, 
      osszegek, 
      tetelek,
      felhasznaloId
    } = req.body;
    
    // Rendelés azonosító generálása
    const rendelesAzonosito = `R-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    
    // Rendelés létrehozása
    const ujRendeles = await Rendeles.create({
      rendelesAzonosito,
      vevoNev: `${vevoAdatok.lastName} ${vevoAdatok.firstName}`,
      vevoEmail: vevoAdatok.email,
      vevoTelefon: vevoAdatok.phone,
      szallitasiCim: szallitasiAdatok.address,
      szallitasiVaros: szallitasiAdatok.city,
      szallitasiIrsz: szallitasiAdatok.zipCode,
      fizetesiMod,
      osszeg: osszegek.subtotal,
      szallitasiDij: osszegek.shipping,
      kedvezmeny: osszegek.discount || 0,
      vegosszeg: osszegek.total,
      felhasznaloId: felhasznaloId || null
    }, { transaction });
    
    // Rendelés tételek létrehozása
    const tetelPromises = tetelek.map(tetel => 
      RendelesTetelek.create({
        rendelesId: ujRendeles.azonosito,
        termekId: tetel.id,
        termekNev: tetel.name,
        mennyiseg: tetel.quantity,
        egysegAr: tetel.discountPrice || tetel.price,
        osszAr: (tetel.discountPrice || tetel.price) * tetel.quantity
      }, { transaction })
    );
    
    await Promise.all(tetelPromises);
    
    // Tranzakció véglegesítése
    await transaction.commit();
    
    // Visszaadjuk a létrehozott rendelést
    res.status(201).json({
      success: true,
      rendelesAzonosito,
      rendeles: ujRendeles
    });
  } catch (error) {
    // Hiba esetén visszagörgetjük a tranzakciót
    await transaction.rollback();
    
    console.error("Hiba a rendelés létrehozásakor:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update an existing rendeles
exports.updateRendeles = async (req, res) => {
  try {
    const rendeles = await Rendeles.findByPk(req.params.id);
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    
    // Csak az állapot frissítése (pl. admin felületen)
    await rendeles.update({
      allapot: req.body.allapot
    });
    
    res.json({
      success: true,
      message: "Rendelés állapota frissítve",
      rendeles
    });
  } catch (error) {
    console.error("Hiba a rendelés frissítésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a rendeles
exports.deleteRendeles = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const rendeles = await Rendeles.findByPk(req.params.id);
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    
    // Először töröljük a tételeket
    await RendelesTetelek.destroy({
      where: { rendelesId: rendeles.azonosito },
      transaction
    });
    
    // Majd töröljük a rendelést
    await rendeles.destroy({ transaction });
    
    // Tranzakció véglegesítése
    await transaction.commit();
    
    res.json({ 
      success: true,
      message: "Rendeles deleted successfully" 
    });
  } catch (error) {
    // Hiba esetén visszagörgetjük a tranzakciót
    await transaction.rollback();
    
    console.error("Hiba a rendelés törlésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get rendelés tételek by rendelés ID
exports.getRendelesTetelek = async (req, res) => {
  try {
    const tetelek = await RendelesTetelek.findAll({
      where: { rendelesId: req.params.id },
      include: [{
        model: Termek,
        attributes: ['nev', 'kepUrl']
      }]
    });
    
    res.json(tetelek);
  } catch (error) {
    console.error("Hiba a rendelés tételek lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
