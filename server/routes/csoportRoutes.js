const express = require("express");
const router = express.Router();
const csoportController = require("../Controller/csoportController");

router.get("/", csoportController.getAllCsoport);
router.get("/:id", csoportController.getCsoportById);
router.post("/", csoportController.createCsoport);

module.exports = router;
