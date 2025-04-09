const express = require("express");
const router = express.Router();
const rendelesController = require("../Controller/rendelesController");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      const token = authHeader && authHeader.split(" ")[1]; 
      
      console.log("Auth header:", authHeader); 
      
      if (!token) {
        return res.status(401).json({ message: "Nincs token megadva" });
      }
  
      jwt.verify(token, "secretkey", (err, user) => {
        if (err) {
          console.log("Token verification error:", err.message); 
          return res.status(403).json({ message: "Érvénytelen token" });
        }
        
        console.log("Decoded user from token:", user); 
        req.user = user;
        next();
      });
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ message: "Hitelesítési hiba", error: error.message });
    }
  };


const optionalAuthenticateToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.split(" ")[1]; 
    
    jwt.verify(token, "secretkey", (err, user) => {
      if (err) {
    
        console.log("Token verification error:", err.message);
        return next();
      }
      
     
      req.user = user;
      next();
    });
  } catch (error) {
   
    console.error("Authentication error:", error);
    next();
  }
};


router.get("/", rendelesController.getAllRendeles);
router.post("/", optionalAuthenticateToken, rendelesController.createRendeles);
router.get("/my-orders", authenticateToken, rendelesController.getUserOrders);
router.get("/stats", authenticateToken, rendelesController.getOrderStats);

router.put("/cancel/:id", authenticateToken, rendelesController.cancelOrder);

router.get("/:id", rendelesController.getRendelesById);
router.put("/:id", rendelesController.updateRendeles);
router.delete("/:id", rendelesController.deleteRendeles);
router.get("/:id/tetelek", rendelesController.getRendelesTetelek);




module.exports = router;
