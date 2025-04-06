const express = require("express");
const router = express.Router();
const raktarKeszlet2Controller = require("../Controller/raktarKeszlet2Controller");

// Get all készletek
router.get("/", raktarKeszlet2Controller.getAllRaktarKeszlet2);

// Get készletek by raktarId
router.get("/raktar/:id", raktarKeszlet2Controller.getByRaktarId);

// Get készletek by termekId
router.get("/termek/:id", raktarKeszlet2Controller.getByTermekId);

// Get specific készlet by raktarId and termekId
router.get("/:raktarId/:termekId", raktarKeszlet2Controller.getSpecificKeszlet);

// Create new készlet
router.post("/", raktarKeszlet2Controller.createRaktarKeszlet2);

// Update készlet
router.put("/:raktarId/:termekId", raktarKeszlet2Controller.updateRaktarKeszlet2);

// Delete készlet
router.delete("/:raktarId/:termekId", raktarKeszlet2Controller.deleteRaktarKeszlet2);

module.exports = router;
