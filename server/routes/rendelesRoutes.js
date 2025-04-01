const express = require("express");
const router = express.Router();
const rendelesController = require("../Controller/rendelesController");
const jwt = require("jsonwebtoken"); // Adjuk hozzá ezt a sort

// Middleware a token ellenőrzéshez
// JWT token ellenőrző middleware
const authenticateToken = (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN formátum
      
      console.log("Auth header:", authHeader); // Debug
      
      if (!token) {
        return res.status(401).json({ message: "Nincs token megadva" });
      }
  
      jwt.verify(token, "secretkey", (err, user) => {
        if (err) {
          console.log("Token verification error:", err.message); // Debug
          return res.status(403).json({ message: "Érvénytelen token" });
        }
        
        console.log("Decoded user from token:", user); // Debug - ellenőrizd a userId mezőt
        req.user = user;
        next();
      });
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ message: "Hitelesítési hiba", error: error.message });
    }
  };
  
// Rendelés kezelő útvonalak
router.get("/", rendelesController.getAllRendeles);
router.get("/:id", rendelesController.getRendelesById);
router.post("/", rendelesController.createRendeles);
router.put("/:id", rendelesController.updateRendeles);
router.delete("/:id", rendelesController.deleteRendeles);
// Rendelés létrehozása - használjuk az opcionális autentikációt

// Rendelés tételek lekérdezése
router.get("/:id/tetelek", rendelesController.getRendelesTetelek);

// FONTOS: Adjuk hozzá a my-orders végpontot
// Figyelem: ezt a /:id útvonal elé kell tenni, különben a :id paraméter elfogja a kérést
router.get("/my-orders", authenticateToken, rendelesController.getUserOrders);

module.exports = router;
