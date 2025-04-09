const express = require("express");
const router = express.Router();
const raktarKeszlet2Controller = require("../Controller/raktarKeszlet2Controller");


router.get("/", raktarKeszlet2Controller.getAllRaktarKeszlet2);

router.get("/raktar/:id", raktarKeszlet2Controller.getByRaktarId);


router.get("/termek/:id", raktarKeszlet2Controller.getByTermekId);

router.get("/:raktarId/:termekId", raktarKeszlet2Controller.getSpecificKeszlet);

router.post("/", raktarKeszlet2Controller.createRaktarKeszlet2);

router.put("/:raktarId/:termekId", raktarKeszlet2Controller.updateRaktarKeszlet2);

router.delete("/:raktarId/:termekId", raktarKeszlet2Controller.deleteRaktarKeszlet2);

module.exports = router;
