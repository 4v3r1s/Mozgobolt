const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const createUser = async (req, res) => {
    try {
        const { email, jelszo, felhasznalonev, telefonszam, vezeteknev, keresztnev, szuletesidatum, szerep, szamlazasi_nev, szamlazasi_irsz, szamlazasi_telepules, szamlazasi_kozterulet, szamlazasi_hazszam, adoszam, szallitasi_nev, szallitasi_irsz, szallitasi_telepules, szallitasi_kozterulet, szallitasi_hazszam, hirlevel } = req.body;
        if (!email || !jelszo || !felhasznalonev) {
            return res.status(400).json({ message: "Hiányzó kötelező mezők!" });
        }
        const hashedPassword = await bcrypt.hash(jelszo, 10);
        const newUser = await User.create({ email, jelszo: hashedPassword, felhasznalonev, telefonszam, vezeteknev, keresztnev, szuletesidatum, szerep, szamlazasi_nev, szamlazasi_irsz, szamlazasi_telepules, szamlazasi_kozterulet, szamlazasi_hazszam, adoszam, szallitasi_nev, szallitasi_irsz, szallitasi_telepules, szallitasi_kozterulet, szallitasi_hazszam, hirlevel });
        res.status(201).json({ message: "Felhasználó sikeresen létrehozva!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Hiba a felhasználó létrehozása közben", error });
    }
};


// Authenticate User (Login)
const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Missing credentials!" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ message: "Invalid email or password!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password!" });

        const token = jwt.sign({ userId: user.id, email: user.email }, "secretkey", { expiresIn: "1h" });
        res.json({ message: "Login successful!", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error during authentication", error });
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

module.exports = { createUser, authenticateUser, getUser, updateUser, deleteUser };
