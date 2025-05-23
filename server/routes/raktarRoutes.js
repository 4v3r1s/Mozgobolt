const express = require("express");
const router = express.Router();
const raktarController = require("../Controller/raktarController");

router.get("/", raktarController.getAllRaktar);
router.get("/:id", raktarController.getRaktarById);
router.post("/", raktarController.createRaktar);
router.put("/:id", raktarController.updateRaktar);
router.delete("/:id", raktarController.deleteRaktar);

router.get("/rendszam/:rendszam", raktarController.getRaktarByRendszam);
router.patch("/:id/max-kapacitas", raktarController.updateMaxKapacitas);
router.get("/", raktarController.getAllRaktar);

module.exports = router;
