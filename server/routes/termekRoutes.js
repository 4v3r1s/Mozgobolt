const express = require("express");
const router = express.Router();
const termekController = require("../Controller/termekController");
const cartController = require("../Controller/cartController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
   
    const dir = path.join(__dirname, '../../public/termek-kepek/');
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    console.log("Saving file to directory:", dir);
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const filename = `termek-${Date.now()}${path.extname(file.originalname)}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  }
});


const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Csak képfájlok tölthetők fel!"));
  }
}).single('kep');

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    console.log('Multipart form data detected');
  }
  next();
});


router.post("/", function(req, res, next) {
  console.log("Processing POST request to /termek");
  
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "File upload error", error: err.message });
    } else if (err) {
      console.error("Unknown upload error:", err);
      return res.status(500).json({ message: "Unknown upload error", error: err.message });
    }
    
    console.log("File upload middleware processed");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    
    next();
  });
}, termekController.createTermek);

router.get("/", termekController.getAllTermek);
router.get("/:id", termekController.getTermekById);

router.put("/:id", function(req, res, next) {
  upload(req, res, function(err) {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ message: "File upload error", error: err.message });
    }
    next();
  });
}, termekController.updateTermek);

router.delete("/:id", termekController.deleteTermek);


router.get("/cart", cartController.getCart);
router.post("/cart/add", cartController.addToCart);
router.put("/cart/update", cartController.updateCartItem);
router.delete("/cart/remove/:id", cartController.removeFromCart);
router.delete("/cart/clear", cartController.clearCart);

module.exports = router;
