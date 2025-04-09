
const Termek = require("../model/termek");


exports.getCart = async (req, res) => {
  try {
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { termekId, quantity } = req.body;
    
   
    const termek = await Termek.findByPk(termekId);
    if (!termek) {
      return res.status(404).json({ message: "Termék nem található" });
    }
    
    
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
    
    const existingItemIndex = req.session.cart.findIndex(item => item.id === termekId);
    
    if (existingItemIndex !== -1) {

      req.session.cart[existingItemIndex].quantity += quantity;
    } else {
  
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
    

    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { termekId, quantity } = req.body;
    
  
    if (!req.session.cart) {
      req.session.cart = [];
    }
    

    const existingItemIndex = req.session.cart.findIndex(item => item.id === termekId);
    
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Termék nem található a kosárban" });
    }
    

    req.session.cart[existingItemIndex].quantity = quantity;
    

    if (quantity <= 0) {
      req.session.cart.splice(existingItemIndex, 1);
    }
    

    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const termekId = req.params.id;
    
  
    if (!req.session.cart) {
      req.session.cart = [];
    }
    
  
    req.session.cart = req.session.cart.filter(item => item.id !== termekId);
    
   
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.clearCart = async (req, res) => {
  try {

    req.session.cart = [];
    
 
    res.json(req.session.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
