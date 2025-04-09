const express = require("express");
const router = express.Router();
const raktarKeszletController = require("../Controller/raktarKeszletController");

router.get("/", raktarKeszletController.getAllRaktarKeszlet);
router.get("/:id", raktarKeszletController.getRaktarKeszletById);
router.post("/", raktarKeszletController.createRaktarKeszlet);
router.put("/:id", raktarKeszletController.updateRaktarKeszlet);
router.delete("/:id", raktarKeszletController.deleteRaktarKeszlet);

router.get("/raktar/:raktarId", raktarKeszletController.getKeszletByRaktarId);
router.get("/termek/:termekId", raktarKeszletController.getKeszletByTermekId);

router.patch("/:id/keszlet", raktarKeszletController.updateKeszletOnly);

module.exports = router;
