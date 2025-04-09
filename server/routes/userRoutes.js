
const express = require("express");
const jwt = require("jsonwebtoken"); 
const router = express.Router();
const userController = require("../Controller/userController"); 


const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1]; 
        
        console.log("Auth header:", authHeader); 
        console.log("Token received:", token); 
        
        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ message: "Nincs token megadva" });
        }

        jwt.verify(token, "secretkey", (err, user) => {
            if (err) {
                console.log("Token verification error:", err.message);
                return res.status(403).json({ message: "Érvénytelen token" });
            }
            
            console.log("Decoded user:", user); 
            req.user = user; 
            next(); 
        });
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Hitelesítési hiba", error: error.message });
    }
};


const isAdmin = (req, res, next) => {

    authenticateToken(req, res, () => {
     
        if (req.user && req.user.role === 'admin') {
            next(); 
        } else {
            res.status(403).json({ message: "Admin jogosultság szükséges" }); 
        }
    });
};



router.post("/addUser", userController.createUser); 
router.post("/login", userController.authenticateUser); 
router.get("/getUser/:id", userController.getUser); 
router.put("/updateUser/:id", userController.updateUser); 
router.delete("/deleteUser/:id", userController.deleteUser); 

router.get("/profile", authenticateToken, userController.getUserProfile);

router.get("/all", isAdmin, userController.getAllUsers);

router.get("/orders", authenticateToken, userController.getUserOrders);

router.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});

module.exports = router;
