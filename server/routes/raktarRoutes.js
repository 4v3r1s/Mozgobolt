const express = require("express");
const router = express.Router();
const raktarController = require("../Controller/raktarController");

// Alap CRUD műveletek
router.get("/", raktarController.getAllRaktar);
router.get("/:id", raktarController.getRaktarById);
router.post("/", raktarController.createRaktar);
router.put("/:id", raktarController.updateRaktar);
router.delete("/:id", raktarController.deleteRaktar);

// Új végpontok
router.get("/rendszam/:rendszam", raktarController.getRaktarByRendszam);
router.patch("/:id/max-kapacitas", raktarController.updateMaxKapacitas);

module.exports = router;
