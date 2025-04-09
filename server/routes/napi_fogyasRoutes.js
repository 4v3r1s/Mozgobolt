const express = require("express");
const router = express.Router();
const napi_fogyasController = require("../Controller/napi_fogyasController");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");


const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; 
    
    if (!token) {
      return res.status(401).json({ message: "Nincs token megadva" });
    }

    jwt.verify(token, "secretkey", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Érvénytelen token" });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Hitelesítési hiba", error: error.message });
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/napi-fogyas"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});


router.get("/", authenticateToken, napi_fogyasController.getAllNapiFogyas);
router.get("/statistics", authenticateToken, napi_fogyasController.getNapiFogyasStatistics);
router.get("/:id", authenticateToken, napi_fogyasController.getNapiFogyasById);
router.post("/", authenticateToken, napi_fogyasController.createNapiFogyas);
router.put("/:id", authenticateToken, napi_fogyasController.updateNapiFogyas);
router.delete("/:id", authenticateToken, napi_fogyasController.deleteNapiFogyas);


router.post("/upload", authenticateToken, upload.single("file"), napi_fogyasController.uploadNapiFogyas);

module.exports = router;
