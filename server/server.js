const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config");
const termekRoutes = require("./routes/termekRoutes");
const csoportRoutes = require("./routes/csoportRoutes");
const napi_fogyasRoutes = require("./routes/napi_fogyasRoutes");
const raktarRoutes = require("./routes/raktarRoutes");
const rendelesRoutes = require("./routes/rendelesRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require('./routes/adminRoutes');

// Import models directly
const Rendeles = require('./model/rendeles');
const RendelesTetelek = require('./model/rendelesTetelek');
const User = require('./model/user');
const Termek = require('./model/termek');

const app = express();

// Configure CORS more explicitly
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Add your client URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
const path = require('path');

// Set up associations directly
// Only set these up if the models exist
if (User) {
  Rendeles.belongsTo(User, {
    foreignKey: 'felhasznaloId',
    targetKey: 'id'
  });
}

if (RendelesTetelek && Rendeles) {
  Rendeles.hasMany(RendelesTetelek, {
    foreignKey: 'rendelesId',
    sourceKey: 'azonosito'
  });

  RendelesTetelek.belongsTo(Rendeles, {
    foreignKey: 'rendelesId',
    targetKey: 'azonosito'
  });
}

if (RendelesTetelek && Termek) {
  RendelesTetelek.belongsTo(Termek, {
    foreignKey: 'termekId',
    targetKey: 'azonosito'
  });
}

// Statikus fájlok kiszolgálása - az egész public mappát kiszolgáljuk
app.use(express.static(path.join(__dirname, '../public')));

// Régi konfiguráció megtartása is
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/termek-kepek', express.static(path.join(__dirname, '../public/termek-kepek')));

// Add detailed request logging BEFORE routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// API routes - register them in the right order
// First register the /api prefixed routes
app.use("/api/rendeles", rendelesRoutes);
app.use("/api/csoport", csoportRoutes);

// Then register the non-prefixed routes
app.use("/termek", termekRoutes);
app.use("/csoport", csoportRoutes);
app.use("/napi_fogyas", napi_fogyasRoutes);
app.use("/raktar", raktarRoutes);
app.use("/rendeles", rendelesRoutes);
app.use("/user", userRoutes);
app.use('/admin', adminRoutes);

// Add a catch-all route to handle 404s and log them
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});

// Sync all models with the database
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synchronized successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
