const Termek = require("../model/termek");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer konfiguráció a képfeltöltéshez
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../../public/termek-kepek/');
    // Ellenőrizzük, hogy létezik-e a könyvtár, ha nem, létrehozzuk
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, `termek-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    // Csak képfájlokat fogadunk el
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Csak képfájlok tölthetők fel!"));
  }
}).single('kep'); // 'kep' a fájl mező neve a form-ban

// Get all termekek
exports.getAllTermek = async (req, res) => {
  try {
    const termekek = await Termek.findAll();
    res.json(termekek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a termek by ID
exports.getTermekById = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    res.json(termek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new termek
exports.createTermek = async (req, res) => {
  try {
    // Ha van kép feltöltve (multer middleware után)
    if (req.file) {
      req.body.kepUrl = `/termek-kepek/${req.file.filename}`;
    }
    
    const newTermek = await Termek.create(req.body);
    res.status(201).json(newTermek);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing termek
exports.updateTermek = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    
    // Ha van kép feltöltve (multer middleware után)
    if (req.file) {
      req.body.kepUrl = `/termek-kepek/${req.file.filename}`;
    }
    
    await termek.update(req.body);
    res.json(await Termek.findByPk(req.params.id));
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a termek
exports.deleteTermek = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    
    // Ha van kép, töröljük a fájlrendszerből
    if (termek.kepUrl) {
      const imagePath = path.join(__dirname, '../../public', termek.kepUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await termek.destroy();
    res.json({ message: "Termek deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
