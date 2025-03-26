// routes/userRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken"); // Import jwt for token verification
const router = express.Router();
const userController = require("../Controller/userController"); // Ensure this path is correct

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Example header format: "Bearer TOKEN"
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, "secretkey", (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user info to the request
        next(); // Call the next middleware or route handler
    });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    // First authenticate the token
    authenticateToken(req, res, () => {
        // Then check if user is admin
        if (req.user && req.user.role === 'admin') {
            next(); // User is admin, proceed
        } else {
            res.status(403).json({ message: "Admin jogosultság szükséges" }); // Forbidden
        }
    });
};


// API endpoints
router.post("/addUser", userController.createUser); // Create a new user
router.post("/login", userController.authenticateUser); // Authenticate a user
router.get("/getUser/:id", userController.getUser); // Get user by ID
router.put("/updateUser/:id", userController.updateUser); // Update user by ID
router.delete("/deleteUser/:id", userController.deleteUser); // Delete user by ID
// Add this new route for getting the current user's profile
router.get("/profile", authenticateToken, userController.getUserProfile);
// Admin only route to get all users
router.get("/all", isAdmin, userController.getAllUsers);

// Use authenticateToken for the protected route
router.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});

module.exports = router;
