const express = require("express");
const router = express.Router();
const vevoController = require("../Controller/vevoController");

router.get("/", vevoController.getAllVevo);
router.get("/:id", vevoController.getVevoById);
router.post("/", vevoController.createVevo);

module.exports = router;
