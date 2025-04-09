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

       
        if (!user.id) {
            console.error("User ID is missing:", user);
            return res.status(500).json({ message: "Hiba a bejelentkezés során: hiányzó felhasználói azonosító" });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.szerep 
            },
            "secretkey",
            { expiresIn: "1h" }
        );

       
        console.log("Generated token:", token);
        console.log("Token payload:", { userId: user.id, email: user.email, role: user.szerep });

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000, 
            sameSite: 'lax'
        });

        res.json({ message: "Sikeres bejelentkezés!", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Hiba a bejelentkezés során", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["jelszo"] } 
        });
        res.json(users);
    } catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ message: "Hiba a felhasználók lekérése során", error: error.message });
    }
};

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


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        
        if (updates.jelszo) {
            updates.jelszo = await bcrypt.hash(updates.jelszo, 10);
        }

       
        delete updates.createdAt;
        delete updates.updatedAt;
        delete updates.id; 

        
        if (updates.szuletesidatum && typeof updates.szuletesidatum === 'string') {
            updates.szuletesidatum = new Date(updates.szuletesidatum);
        }

        
        if (updates.szamlazasi_irsz && typeof updates.szamlazasi_irsz === 'string') {
            updates.szamlazasi_irsz = parseInt(updates.szamlazasi_irsz, 10) || null;
        }
        
        if (updates.szallitasi_irsz && typeof updates.szallitasi_irsz === 'string') {
            updates.szallitasi_irsz = parseInt(updates.szallitasi_irsz, 10) || null;
        }

        console.log("Updating user with data:", JSON.stringify(updates, null, 2));

        const [updated] = await User.update(updates, { 
            where: { id },
            
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
const getUserProfile = async (req, res) => {
    try {
        console.log("User from token:", req.user);
        
        const userId = req.user.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "Hiányzó felhasználói azonosító" });
        }
        
        const user = await User.findByPk(userId, { 
            attributes: { 
                exclude: ["jelszo"] 
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



const getUserOrders = async (req, res) => {
    try {
      const userId = req.user.userId;
      
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
  