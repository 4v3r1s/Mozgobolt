const Termek = require("../model/termek");
const path = require("path");
const fs = require("fs");


exports.getAllTermek = async (req, res) => {
  try {
    const termekek = await Termek.findAll();
    res.json(termekek);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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


exports.createTermek = async (req, res) => {
  try {
    console.log("Creating product with data:", req.body);
    console.log("File received:", req.file);
    
   
    if (!req.body.vonalkod) {
      return res.status(400).json({ message: "Vonalkod is required" });
    }
    
  
    if (typeof req.body.vonalkod === 'object' || Array.isArray(req.body.vonalkod)) {
      return res.status(400).json({ 
        message: "Validation error", 
        error: "vonalkod cannot be an array or an object" 
      });
    }
    
    
    req.body.vonalkod = String(req.body.vonalkod);
    
  
    if (req.file) {

      req.body.kepUrl = `/termek-kepek/${req.file.filename}`;
      console.log("Image URL set to:", req.body.kepUrl);
    }
    
    const newTermek = await Termek.create(req.body);
    res.status(201).json(newTermek);
  } catch (error) {
    console.error("Error creating product:", error);
    
    
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


exports.updateTermek = async (req, res) => {
  try {
    console.log("Updating product with data:", req.body);
    console.log("File received:", req.file);
    
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    
    
    const updateData = {};
    
   
    ['nev', 'termekleiras', 'kiszereles', 'hivatkozas', 'ajanlott_termekek', 
     'afa_kulcs', 'meret', 'szin', 'vonalkod'].forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field] || null;
      }
    });
    
   
    ['ar', 'egysegnyiar', 'csoport', 'keszlet', 'akciosar', 'akcios_egysegnyiar'].forEach(field => {
      if (req.body[field] !== undefined) {
        
        updateData[field] = req.body[field] === '' ? null : 
                           isNaN(Number(req.body[field])) ? null : Number(req.body[field]);
      }
    });
    
   
    ['akcio_vege', 'akcio_eleje'].forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field] || null;
      }
    });
    
   
    if (req.body.tizennyolc !== undefined) {
      updateData.tizennyolc = req.body.tizennyolc === 'true' || req.body.tizennyolc === true;
    }
    
    
    if (req.file) {
      try {
        
        if (termek.kepUrl) {
          
          const oldImagePath = path.join(__dirname, '../../public', termek.kepUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Old image deleted:", oldImagePath);
          }
        }
        
        
        updateData.kepUrl = `/termek-kepek/${req.file.filename}`;
        console.log("New image URL set to:", updateData.kepUrl);
      } catch (imageError) {
        console.error("Error handling image:", imageError);
        
      }
    }
    
    console.log("Final update data:", updateData);
    
  
    await termek.update(updateData);
    
    
    const updatedTermek = await Termek.findByPk(req.params.id);
    res.json(updatedTermek);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.deleteTermek = async (req, res) => {
  try {
    const termek = await Termek.findByPk(req.params.id);
    if (!termek) {
      return res.status(404).json({ message: "Termek not found" });
    }
    
   
    if (termek.kepUrl) {
     
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
