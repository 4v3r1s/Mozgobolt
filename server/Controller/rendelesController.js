const Rendeles = require("../model/rendeles");
const RendelesTetelek = require("../model/rendelesTetelek");
const Termek = require("../model/termek");
const sequelize = require("../config/config");
const emailService = require("../services/emailService");

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
        as: 'tetelek',
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
      tetelek
    } = req.body;
    
    // Felhasználói azonosító kinyerése a JWT tokenből, ha van
    let felhasznaloId = null;
    if (req.user && req.user.userId) {
      felhasznaloId = req.user.userId;
      console.log("Felhasználói azonosító beállítva:", felhasznaloId);
    }
    
    // Rendelés azonosító generálása
    const rendelesAzonosito = `R-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    
    // Rendelés létrehozása
    const ujRendeles = await Rendeles.create({
      rendelesAzonosito,
      felhasznaloId,
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
      allapot: "feldolgozás alatt",
      rendelesIdeje: new Date()
    }, { transaction });
    
    // Rendelési tételek létrehozása
    for (const tetel of tetelek) {
      await RendelesTetelek.create({
        rendelesId: ujRendeles.azonosito,
        termekId: tetel.id,
        termekNev: tetel.name,
        mennyiseg: tetel.quantity,
        egysegAr: tetel.discountPrice || tetel.price,
        osszAr: (tetel.discountPrice || tetel.price) * tetel.quantity
      }, { transaction });
    }
    
    // Tranzakció véglegesítése
    await transaction.commit();
    
    // Válasz küldése a kliensnek
    res.status(201).json({
      success: true,
      rendelesAzonosito,
      rendeles: ujRendeles
    });
    
    // E-mail küldése a rendelés visszaigazolásáról (a válasz után)
    // Ez nem blokkolja a választ, mert a res.json() után fut
    try {
      emailService.sendOrderConfirmation(req.body, rendelesAzonosito)
        .then(info => {
          console.log("Rendelés visszaigazoló e-mail elküldve");
        })
        .catch(emailError => {
          console.error("Hiba a visszaigazoló e-mail küldésekor:", emailError);
        });
    } catch (emailError) {
      console.error("Hiba az e-mail küldés során:", emailError);
      // Itt nem dobunk hibát, mert a rendelés már létrejött
    }
    
  } catch (error) {
    // Hiba esetén visszagörgetjük a tranzakciót
    await transaction.rollback();
    console.error("Hiba a rendelés létrehozásakor:", error);
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
      
      // Get user orders
      exports.getUserOrders = async (req, res) => {
        try {
          // A felhasználó ID-t a JWT tokenből kapjuk
          const userId = req.user.userId;
          
          console.log("Felhasználói rendelések lekérdezése, userId:", userId);
          
          // Ellenőrizzük, hogy a userId megfelelő formátumú-e
          if (!userId || isNaN(parseInt(userId))) {
            console.error("Érvénytelen userId:", userId);
            return res.status(400).json({ message: "Érvénytelen felhasználói azonosító" });
          }
          
          // Naplózzuk a lekérdezés paramétereit
          console.log("Lekérdezés paraméterei:", { felhasznaloId: userId });
          
          // Lekérjük a felhasználó rendeléseit
          const rendelesek = await Rendeles.findAll({
            where: { felhasznaloId: userId },
            order: [['rendelesIdeje', 'DESC']],
            include: [{
              model: RendelesTetelek,
              as: 'tetelek',
              include: [{
                model: Termek,
                attributes: ['nev', 'kepUrl']
              }]
            }]
          });
          
          console.log(`${rendelesek.length} rendelés található a felhasználóhoz (${userId})`);
          
          // Ha nincs rendelés, akkor is küldjünk vissza egy üres tömböt
          if (rendelesek.length === 0) {
            console.log("Nincsenek rendelések a felhasználóhoz");
            return res.json([]);
          }
          
          // Naplózzuk az első rendelés adatait
          if (rendelesek.length > 0) {
            console.log("Első rendelés adatai:", JSON.stringify(rendelesek[0].toJSON(), null, 2));
          }
          
          // Átalakítjuk a rendeléseket a frontend számára megfelelő formátumra
          const formattedOrders = rendelesek.map(rendeles => {
            const rendelesObj = rendeles.toJSON();
            
            return {
              id: rendelesObj.rendelesAzonosito,
              status: rendelesObj.allapot,
              createdAt: rendelesObj.rendelesIdeje,
              total_price: rendelesObj.vegosszeg,
              shipping_address: `${rendelesObj.szallitasiIrsz} ${rendelesObj.szallitasiVaros}, ${rendelesObj.szallitasiCim}`,
              payment_method: rendelesObj.fizetesiMod,
              items: rendelesObj.tetelek ? rendelesObj.tetelek.map(tetel => ({
                product_name: tetel.termekNev,
                product_image: tetel.Termek ? tetel.Termek.kepUrl : null,
                quantity: tetel.mennyiseg,
                price: tetel.egysegAr
              })) : []
            };
          });
          
          console.log("Válasz küldése a kliensnek:", formattedOrders.length, "rendeléssel");
          res.json(formattedOrders);
        } catch (error) {
          console.error("Hiba a felhasználó rendeléseinek lekérdezésekor:", error);
          res.status(500).json({ message: "Hiba a rendelések lekérdezése során", error: error.message });
        }
      };
    
