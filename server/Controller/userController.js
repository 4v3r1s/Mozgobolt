const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const createUser = async (req, res) => {
    try {
        const { email, jelszo, felhasznalonev, hirlevel } = req.body;
        if (!email || !jelszo || !felhasznalonev) {
            return res.status(400).json({ message: "Hiányzó kötelező mezők!" });
        }
        const hashedPassword = await bcrypt.hash(jelszo, 10);
        const newUser = await User.create({ email, jelszo: hashedPassword, felhasznalonev, hirlevel });
        res.status(201).json({ message: "Felhasználó sikeresen létrehozva!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Hiba a felhasználó létrehozása közben", error });
    }
};


// Authenticate User (Login)
const authenticateUser = async (req, res) => {
    try {
        const { email, jelszo } = req.body;
        if (!email || !jelszo) {
            return res.status(400).json({ message: "Hiányzó bejelentkezési adatok!" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Érvénytelen email vagy jelszó!" });
        }

        const isMatch = await bcrypt.compare(jelszo, user.jelszo);
        if (!isMatch) {
            return res.status(401).json({ message: "Érvénytelen email vagy jelszó!" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.json({ message: "Sikeres bejelentkezés!", token});
    } catch (error) {
        res.status(500).json({ message: "Hiba a bejelentkezés során", error });
    }
};

// Get User by ID
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });

        if (!user) return res.status(404).json({ message: "User not found!" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const [updated] = await User.update(updates, { where: { id } });
        if (!updated) return res.status(404).json({ message: "User not found!" });

        res.json({ message: "User updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ message: "User not found!" });

        res.json({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};
// Get Current User Profile
const getUserProfile = async (req, res) => {
    try {
        // The user ID is extracted from the JWT token in the authenticateToken middleware
        const userId = req.user.userId;
        
        const user = await User.findByPk(userId, { 
            attributes: { 
                exclude: ["jelszo"] // Exclude password from the response
            } 
        });

        if (!user) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Hiba a felhasználói adatok lekérése során", error: error.message });
    }
};

module.exports = { createUser, authenticateUser, getUser, updateUser, deleteUser, getUserProfile };
