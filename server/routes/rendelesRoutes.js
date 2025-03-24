const express = require("express");
const router = express.Router();
const rendelesController = require("../Controller/rendelesController");

router.get("/", rendelesController.getAllRendeles);
router.get("/:id", rendelesController.getRendelesById);
router.post("/", rendelesController.createRendeles);
router.put("/:id", rendelesController.updateRendeles);
router.delete("/:id", rendelesController.deleteRendeles);

module.exports = router;
