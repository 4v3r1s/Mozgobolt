// Új controller a kosár kezeléséhez
const Termek = require("../model/termek");

// Kosár lekérése (session alapú)
exports.getCart = async (req, res) => {
  try {
    // Ha nincs kosár a session-ben, inicializáljuk
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Visszaadjuk a kosár tartalmát
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Termék hozzáadása a kosárhoz
exports.addToCart = async (req, res) => {
  try {
    const { termekId, quantity } = req.body;
    
    // Ellenőrizzük, hogy a termék létezik-e
    const termek = await Termek.findByPk(termekId);
    if (!termek) {
      return res.status(404).json({ message: "Termék nem található" });
    }
    
    // Ha nincs kosár a session-ben, inicializáljuk
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Ellenőrizzük, hogy a termék már a kosárban van-e
    const existingItemIndex = req.session.cart.findIndex(item => item.id === termekId);
    
    if (existingItemIndex !== -1) {
      // Ha már a kosárban van, növeljük a mennyiséget
      req.session.cart[existingItemIndex].quantity += quantity;
    } else {
      // Ha még nincs a kosárban, hozzáadjuk
      req.session.cart.push({
        id: termek.azonosito,
        name: termek.nev,
        price: parseFloat(termek.ar),
        discountPrice: termek.akciosar ? parseFloat(termek.akciosar) : null,
        quantity: quantity,
        image: termek.kepUrl,
        unit: termek.kiszereles
      });
    }
    
    // Visszaadjuk a frissített kosarat
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Termék mennyiségének módosítása a kosárban
exports.updateCartItem = async (req, res) => {
  try {
    const { termekId, quantity } = req.body;
    
    // Ha nincs kosár a session-ben, inicializáljuk
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Keressük meg a terméket a kosárban
    const existingItemIndex = req.session.cart.findIndex(item => item.id === termekId);
    
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Termék nem található a kosárban" });
    }
    
    // Frissítjük a mennyiséget
    req.session.cart[existingItemIndex].quantity = quantity;
    
    // Ha a mennyiség 0 vagy kisebb, eltávolítjuk a terméket
    if (quantity <= 0) {
      req.session.cart.splice(existingItemIndex, 1);
    }
    
    // Visszaadjuk a frissített kosarat
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Termék eltávolítása a kosárból
exports.removeFromCart = async (req, res) => {
  try {
    const termekId = req.params.id;
    
    // Ha nincs kosár a session-ben, inicializáljuk
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    // Eltávolítjuk a terméket a kosárból
    req.session.cart = req.session.cart.filter(item => item.id !== termekId);
    
    // Visszaadjuk a frissített kosarat
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Kosár ürítése
exports.clearCart = async (req, res) => {
  try {
    // Kosár ürítése
    req.session.cart = [];
    
    // Visszaadjuk az üres kosarat
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
