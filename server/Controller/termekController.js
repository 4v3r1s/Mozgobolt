const Termek = require("../model/termek");
const path = require("path");
const fs = require("fs");

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
    console.log("Creating product with data:", req.body);
    console.log("File received:", req.file);
    
    // Check if vonalkod is provided and is a valid string
    if (!req.body.vonalkod) {
      return res.status(400).json({ message: "Vonalkod is required" });
    }
    
    // Ensure vonalkod is a string
    if (typeof req.body.vonalkod === 'object' || Array.isArray(req.body.vonalkod)) {
      return res.status(400).json({ 
        message: "Validation error", 
        error: "vonalkod cannot be an array or an object" 
      });
    }
    
    // Convert vonalkod to string if it's not already
    req.body.vonalkod = String(req.body.vonalkod);
    
    // Ha van kép feltöltve (multer middleware után)
    if (req.file) {
      // Csak a relatív útvonalat állítjuk be, nem a teljes útvonalat
      req.body.kepUrl = `/termek-kepek/${req.file.filename}`;
      console.log("Image URL set to:", req.body.kepUrl);
    }
    
    const newTermek = await Termek.create(req.body);
    res.status(201).json(newTermek);
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Check for specific error types
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: "Validation error", 
        error: error.errors.map(e => e.message).join(', ') 
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: "Unique constraint error", 
        error: error.errors.map(e => e.message).join(', ') 
      });
    }
    
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update an existing termek
exports.updateTermek = async (req, res) => {
  try {
    console.log("Updating product with data:", req.body);
    console.log("File received:", req.file);
    
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    
    // Ha van kép feltöltve (multer middleware után)
    if (req.file) {
      // Delete old image if exists
      if (termek.kepUrl) {
        // Módosítjuk a helyes mappára
        const oldImagePath = path.join(__dirname, '../../public', termek.kepUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        }
      }
      
      // Store the relative path to the image
      req.body.kepUrl = `/termek-kepek/${req.file.filename}`;
      console.log("New image URL set to:", req.body.kepUrl);
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
      // Módosítjuk a helyes mappára
      const imagePath = path.join(__dirname, '../../public', termek.kepUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted:", imagePath);
      }
    }
    
    await termek.destroy();
    res.json({ message: "Termek deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
