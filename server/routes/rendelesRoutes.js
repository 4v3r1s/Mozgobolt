const express = require("express");
const router = express.Router();
const rendelesController = require("../Controller/rendelesController");
const jwt = require("jsonwebtoken");

// Middleware a token ellenőrzéshez
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

// Add this middleware to optionally authenticate users
const optionalAuthenticateToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      // No token, but that's okay - continue as guest
      return next();
    }
    
    const token = authHeader.split(" ")[1]; // Bearer TOKEN format
    
    jwt.verify(token, "secretkey", (err, user) => {
      if (err) {
        // Invalid token, but continue as guest
        console.log("Token verification error:", err.message);
        return next();
      }
      
      // Valid token - attach user info
      req.user = user;
      next();
    });
  } catch (error) {
    // Error in authentication, continue as guest
    console.error("Authentication error:", error);
    next();
  }
};

// Rendelés kezelő útvonalak - fontos a sorrend!
// 1. Először a nem-paraméteres útvonalak
router.get("/", rendelesController.getAllRendeles);
router.post("/", optionalAuthenticateToken, rendelesController.createRendeles);
router.get("/my-orders", authenticateToken, rendelesController.getUserOrders);
router.get("/stats", authenticateToken, rendelesController.getOrderStats);

// 2. Aztán a paraméteres útvonalak
router.get("/:id", rendelesController.getRendelesById);
router.put("/:id", rendelesController.updateRendeles);
router.delete("/:id", rendelesController.deleteRendeles);
router.get("/:id/tetelek", rendelesController.getRendelesTetelek);




module.exports = router;
