const express = require("express");
const router = express.Router();
const raktarController = require("../Controller/raktarController");

router.get("/", raktarController.getAllRaktar);
router.get("/:id", raktarController.getRaktarById);
router.post("/", raktarController.createRaktar);

module.exports = router;
