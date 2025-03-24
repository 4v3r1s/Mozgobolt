const express = require("express");
const cors = require("cors");
const sequelize = require("./config/config");
const termekRoutes = require("./routes/termekRoutes");
const csoportRoutes = require("./routes/csoportRoutes");
const napi_fogyasRoutes = require("./routes/napi_fogyasRoutes");
const raktarRoutes = require("./routes/raktarRoutes");
const rendelesRoutes = require("./routes/rendelesRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());


app.use("/termek", termekRoutes);
app.use("/csoport", csoportRoutes);
app.use("/napi_fogyas", napi_fogyasRoutes);
app.use("/raktar", raktarRoutes);
app.use("/rendeles", rendelesRoutes);
app.use("/user", userRoutes);

sequelize.sync({ alter: true }) // `alter: true` ensures that existing tables are updated if needed
    .then(() => console.log("✅ Database synchronized successfully!"))
    .catch((err) => console.error("❌ Error syncing database:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
