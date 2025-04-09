const Rendeles = require("../model/rendeles");
const RendelesTetelek = require("../model/rendelesTetelek");
const Termek = require("../model/termek");
const sequelize = require("../config/config");
const emailService = require("../services/emailService");


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
    
    
    let felhasznaloId = null;
    if (req.user && req.user.userId) {
      felhasznaloId = req.user.userId;
      console.log("Felhasználói azonosító beállítva:", felhasznaloId);
    }
    
   
    const rendelesAzonosito = `R-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000)}`;
    
    
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
    
    
    await transaction.commit();
    
    
    res.status(201).json({
      success: true,
      rendelesAzonosito,
      rendeles: ujRendeles
    });
    
   
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
      
    }
    
  } catch (error) {
   
    await transaction.rollback();
    console.error("Hiba a rendelés létrehozásakor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateRendeles = async (req, res) => {
  try {
    const rendeles = await Rendeles.findByPk(req.params.id);
    if (!rendeles) {
      return res.status(404).json({ message: "Rendeles not found" });
    }
    
          
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
      
      
      exports.deleteRendeles = async (req, res) => {
        const transaction = await sequelize.transaction();
        
        try {
          const rendeles = await Rendeles.findByPk(req.params.id);
          if (!rendeles) {
            return res.status(404).json({ message: "Rendeles not found" });
          }
          
          
          await RendelesTetelek.destroy({
            where: { rendelesId: rendeles.azonosito },
            transaction
          });
          
        
          await rendeles.destroy({ transaction });
          
         
          await transaction.commit();
          
          res.json({ 
            success: true,
            message: "Rendeles deleted successfully" 
          });
        } catch (error) {
          
          await transaction.rollback();
          
          console.error("Hiba a rendelés törlésekor:", error);
          res.status(500).json({ message: "Server error", error: error.message });
        }
      };
      
      
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
      
      
      exports.getUserOrders = async (req, res) => {
        try {
          
          const userId = req.user.userId;
          
          console.log("Felhasználói rendelések lekérdezése, userId:", userId);
          
          
          if (!userId || isNaN(parseInt(userId))) {
            console.error("Érvénytelen userId:", userId);
            return res.status(400).json({ message: "Érvénytelen felhasználói azonosító" });
          }
          
          
          console.log("Lekérdezés paraméterei:", { felhasznaloId: userId });
          
          
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
          
          
          if (rendelesek.length === 0) {
            console.log("Nincsenek rendelések a felhasználóhoz");
            return res.json([]);
          }
          
          if (rendelesek.length > 0) {
            console.log("Első rendelés adatai:", JSON.stringify(rendelesek[0].toJSON(), null, 2));
          }
          
          
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

exports.getOrderStats = async (req, res) => {
  try {
    
    const allOrders = await Rendeles.findAll();
  
   
    const totalOrders = allOrders.length;
  

    const pendingOrders = allOrders.filter(order => order.allapot === "feldolgozás alatt").length;
  

    const shippingOrders = allOrders.filter(order => order.allapot === "kiszállítás alatt").length;
  
   
    const completedOrders = allOrders.filter(order => order.allapot === "teljesítve").length;
  
    const cancelledOrders = allOrders.filter(order => order.allapot === "törölve").length;
  

    const recentOrders = await Rendeles.findAll({
      order: [['rendelesIdeje', 'DESC']],
      limit: 5,
      include: [{
        model: RendelesTetelek,
        as: 'tetelek',
        include: [{
          model: Termek,
          attributes: ['nev', 'kepUrl']
        }]
      }]
    });
  
    
    const totalRevenue = allOrders
      .filter(order => order.allapot !== "törölve")
      .reduce((sum, order) => sum + parseFloat(order.vegosszeg), 0);
  
  
    res.json({
      totalOrders,
      pendingOrders,
      shippingOrders,
      completedOrders,
      cancelledOrders,
      recentOrders,
      totalRevenue
    });
  } catch (error) {
    console.error("Hiba a rendelés statisztikák lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
 
    const userId = req.user.userId;
    const orderId = req.params.id;
    
    console.log(`Rendelés törlése: ${orderId}, felhasználó: ${userId}`);
    
    
    const rendeles = await Rendeles.findOne({
      where: { 
        rendelesAzonosito: orderId,
        felhasznaloId: userId  
      }
    });
    
    if (!rendeles) {
      return res.status(404).json({ message: "Rendelés nem található vagy nem a felhasználóhoz tartozik" });
    }
    
    
    if (rendeles.allapot !== "feldolgozás alatt") {
      return res.status(400).json({ 
        message: "A rendelés nem törölhető, mert már feldolgozás alatt van vagy már kiszállították" 
      });
    }
    
    
    await rendeles.update({ allapot: "törölve" });
    
    
    res.json({ 
      success: true, 
      message: "Rendelés sikeresen törölve",
      rendeles: rendeles
    });
    
  
    try {
      emailService.sendOrderCancellationEmail(rendeles)
        .then(info => {
          console.log("Rendelés törlés értesítő e-mail elküldve");
        })
        .catch(emailError => {
          console.error("Hiba a törlés értesítő e-mail küldésekor:", emailError);
        });
    } catch (emailError) {
      console.error("Hiba az e-mail küldés során:", emailError);
      
    }
    
  } catch (error) {
    console.error("Hiba a rendelés törlésekor:", error);
    res.status(500).json({ message: "Szerver hiba", error: error.message });
  }
};
