// Kosár kezelő controller
const Termek = require("../model/termek");

// Kosár lekérése (jelenleg csak egy dummy implementáció, mivel a kosár a kliens oldalon van)
exports.getCart = async (req, res) => {
  try {
    res.json({ message: "Kosár lekérése sikeres", cart: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Termék hozzáadása a kosárhoz
exports.addToCart = async (req, res) => {
  try {
    const { termekId, quantity } = req.body;
    
    if (!termekId) {
      return res.status(400).json({ message: "Termék azonosító megadása kötelező" });
    }
    
    // Ellenőrizzük, hogy létezik-e a termék
    const termek = await Termek.findByPk(termekId);
    if (!termek) {
      return res.status(404).json({ message: "A megadott termék nem található" });
    }
    
    // Formázzuk a terméket a kosár számára
    const cartItem = {
      id: termek.azonosito,
      name: termek.nev,
      price: parseFloat(termek.ar),
      discountPrice: termek.akciosar ? parseFloat(termek.akciosar) : null,
      image: termek.kepUrl ? `http://localhost:3000${termek.kepUrl}` : termek.hivatkozas,
      quantity: quantity || 1,
      unit: termek.kiszereles || 'db'
    };
    
    res.status(200).json({ 
      message: "Termék sikeresen hozzáadva a kosárhoz", 
      cartItem 
    });
  } catch (error) {
    console.error("Kosár hiba:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Termék mennyiségének módosítása a kosárban
exports.updateCartItem = async (req, res) => {
  try {
    const { termekId, quantity } = req.body;
    
    if (!termekId || !quantity) {
      return res.status(400).json({ message: "Termék azonosító és mennyiség megadása kötelező" });
    }
    
    // Ellenőrizzük, hogy létezik-e a termék
    const termek = await Termek.findByPk(termekId);
    if (!termek) {
      return res.status(404).json({ message: "A megadott termék nem található" });
    }
    
    res.status(200).json({ 
      message: "Kosár elem sikeresen frissítve", 
      termekId,
      quantity
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Termék eltávolítása a kosárból
exports.removeFromCart = async (req, res) => {
  try {
    const termekId = req.params.id;
    
    if (!termekId) {
      return res.status(400).json({ message: "Termék azonosító megadása kötelező" });
    }
    
    res.status(200).json({ 
      message: "Termék sikeresen eltávolítva a kosárból", 
      termekId 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Kosár ürítése
exports.clearCart = async (req, res) => {
  try {
    res.status(200).json({ message: "Kosár sikeresen ürítve" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
