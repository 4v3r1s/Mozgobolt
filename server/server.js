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
const emailService = require('./services/emailService');
const emailRoutes = require('./routes/emailRoutes');
const raktarKeszletRoutes = require('./routes/raktarKeszletRoutes');
const raktarKeszlet2Routes = require("./routes/raktarKeszlet2Routes");


const Rendeles = require('./model/rendeles');
const RendelesTetelek = require('./model/rendelesTetelek');
const User = require('./model/user');
const Termek = require('./model/termek');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

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


app.use(express.static(path.join(__dirname, '../public')));
app.use('/email', emailRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/termek-kepek', express.static(path.join(__dirname, '../public/termek-kepek')));
app.use("/raktar-keszlet", raktarKeszletRoutes);
app.use("/raktarkeszlet2", raktarKeszlet2Routes);
app.use("/api/napi-fogyas", napi_fogyasRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});


app.use("/api/rendeles", rendelesRoutes);
app.use("/api/csoport", csoportRoutes);
app.use("/api/raktar", raktarRoutes);

app.use("/termek", termekRoutes);
app.use("/csoport", csoportRoutes);
app.use("/napi_fogyas", napi_fogyasRoutes);
app.use("/raktar", raktarRoutes);
app.use("/rendeles", rendelesRoutes);
app.use("/user", userRoutes);
app.use('/admin', adminRoutes);



app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ message: "Route not found" });
});


sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synchronized successfully!"))
  .catch((err) => console.error("❌ Error syncing database:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
