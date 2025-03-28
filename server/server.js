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

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');

// Statikus fájlok kiszolgálása - az egész public mappát kiszolgáljuk
app.use(express.static(path.join(__dirname, 'public')));

// Régi konfiguráció megtartása is
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/termek-kepek', express.static(path.join(__dirname, 'public/termek-kepek')));


app.use("/termek", termekRoutes);
app.use("/csoport", csoportRoutes);
app.use("/napi_fogyas", napi_fogyasRoutes);
app.use("/raktar", raktarRoutes);
app.use("/rendeles", rendelesRoutes);
app.use("/user", userRoutes);
app.use('/admin', adminRoutes);
// Add detailed request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    if (req.method === 'POST' || req.method === 'PUT') {
      console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
  

sequelize.sync({ alter: true }) // `alter: true` ensures that existing tables are updated if needed
    .then(() => console.log("✅ Database synchronized successfully!"))
    .catch((err) => console.error("❌ Error syncing database:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
