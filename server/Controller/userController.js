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

        // Ellenőrizzük, hogy a user.id létezik-e
        if (!user.id) {
            console.error("User ID is missing:", user);
            return res.status(500).json({ message: "Hiba a bejelentkezés során: hiányzó felhasználói azonosító" });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.szerep // Add user role to token
            },
            "secretkey",
            { expiresIn: "1h" }
        );

        // Debug: ellenőrizzük a generált tokent
        console.log("Generated token:", token);
        console.log("Token payload:", { userId: user.id, email: user.email, role: user.szerep });

        // Állítsuk be a token cookie-t
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS csak production környezetben
            maxAge: 3600000, // 1 óra
            sameSite: 'lax'
        });

        res.json({ message: "Sikeres bejelentkezés!", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Hiba a bejelentkezés során", error: error.message });
    }
};
// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["jelszo"] } // Exclude password from the response
        });
        res.json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Hiba a felhasználók lekérése során", error: error.message });
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

        // If password is being updated, hash it
        if (updates.jelszo) {
            updates.jelszo = await bcrypt.hash(updates.jelszo, 10);
        }

        // Remove any fields that might cause issues
        delete updates.createdAt;
        delete updates.updatedAt;
        delete updates.id; // Don't try to update the primary key

        // Handle date conversion for szuletesidatum if it's a string
        if (updates.szuletesidatum && typeof updates.szuletesidatum === 'string') {
            updates.szuletesidatum = new Date(updates.szuletesidatum);
        }

        // Convert numeric string values to numbers for integer fields
        if (updates.szamlazasi_irsz && typeof updates.szamlazasi_irsz === 'string') {
            updates.szamlazasi_irsz = parseInt(updates.szamlazasi_irsz, 10) || null;
        }
        
        if (updates.szallitasi_irsz && typeof updates.szallitasi_irsz === 'string') {
            updates.szallitasi_irsz = parseInt(updates.szallitasi_irsz, 10) || null;
        }

        console.log("Updating user with data:", JSON.stringify(updates, null, 2));

        const [updated] = await User.update(updates, { 
            where: { id },
            // Return the updated user
            returning: true
        });

        if (!updated) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        res.json({ message: "Felhasználó sikeresen frissítve!" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ 
            message: "Hiba a felhasználó frissítése során", 
            error: error.message,
            stack: error.stack 
        });
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
        // Debug: ellenőrizzük a req.user objektumot
        console.log("User from token:", req.user);
        
        // The user ID is extracted from the JWT token in the authenticateToken middleware
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "Hiányzó felhasználói azonosító" });
        }
        
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



// Get User Orders
const getUserOrders = async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // Lekérjük a felhasználó rendeléseit
      const rendelesek = await Rendeles.findAll({
        where: { felhasznaloId: userId },
        order: [['rendelesIdeje', 'DESC']],
        include: [{
          model: RendelesTetelek,
          as: 'tetelek',
          include: [{
            model: Termek,
            attributes: ['nev', 'kepUrl']
          }]
        }]
      });
      
      res.json(rendelesek);
    } catch (error) {
      console.error("Hiba a felhasználói rendelések lekérdezésekor:", error);
      res.status(500).json({ message: "Hiba a rendelések lekérdezése során", error: error.message });
    }
  };
  
  // Exportáljuk az új metódust
  module.exports = { 
    createUser, 
    authenticateUser, 
    getUser, 
    updateUser, 
    deleteUser, 
    getUserProfile,
    getAllUsers,
    getUserOrders
  };
  