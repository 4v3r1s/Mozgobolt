const { User, Termek, Rendeles, Csoport, Raktar, napi_fogyas } = require('../model');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.szerep !== 'admin') {
      return res.status(403).json({ message: 'Nincs jogosultsága ehhez a művelethez' });
    }
    
    // Fetch all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'felhasznalonev', 'telefonszam', 'vezeteknev', 'keresztnev', 'szuletesidatum', 'szerep', 'hirlevel']
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Update a user (admin only)
exports.updateUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.szerep !== 'admin') {
      return res.status(403).json({ message: 'Nincs jogosultsága ehhez a művelethez' });
    }
    
    const userId = req.params.id;
    const { felhasznalonev, email, szerep, hirlevel } = req.body;
    
    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    
    // Update user data
    user.felhasznalonev = felhasznalonev;
    user.email = email;
    user.szerep = szerep;
    user.hirlevel = hirlevel;
    
    await user.save();
    
    res.json({ message: 'Felhasználó sikeresen frissítve', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.szerep !== 'admin') {
      return res.status(403).json({ message: 'Nincs jogosultsága ehhez a művelethez' });
    }
    
    const userId = req.params.id;
    
    // Find the user
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    
    // Delete the user
    await user.destroy();
    
    res.json({ message: 'Felhasználó sikeresen törölve' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Szerver hiba történt' });
  }
};
exports.getAllNapiFogyas = async (req, res) => {
  try {
    const napiFogyasok = await napi_fogyas.findAll({
      include: [{
        model: Termek,
        attributes: ['nev', 'kiszereles', 'kepUrl'],
        as: 'termekData'
      }, {
        model: Raktar,
        attributes: ['rendszam'],
        as: 'raktarData'
      }],
      order: [['datum', 'DESC']]
    });
    res.json(napiFogyasok);
  } catch (error) {
    console.error("Hiba a napi fogyás lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getNapiFogyasById = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id, {
      include: [{
        model: Termek,
        attributes: ['nev', 'kiszereles', 'kepUrl'],
        as: 'termekData'
      }, {
        model: Raktar,
        attributes: ['rendszam'],
        as: 'raktarData'
      }]
    });
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    res.json(napiFogyas);
  } catch (error) {
    console.error("Hiba a napi fogyás lekérdezésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateNapiFogyas = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id);
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    await napiFogyas.update(req.body);
    res.json(napiFogyas);
  } catch (error) {
    console.error("Hiba a napi fogyás frissítésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteNapiFogyas = async (req, res) => {
  try {
    const napiFogyas = await napi_fogyas.findByPk(req.params.id);
    if (!napiFogyas) {
      return res.status(404).json({ message: "Napi fogyas not found" });
    }
    await napiFogyas.destroy();
    res.json({ message: "Napi fogyas deleted successfully" });
  } catch (error) {
    console.error("Hiba a napi fogyás törlésekor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};