const express = require("express");
const router = express.Router();
const rendelesController = require("../Controller/rendelesController");

// Rendelés kezelő útvonalak
router.get("/", rendelesController.getAllRendeles);
router.get("/:id", rendelesController.getRendelesById);
router.post("/", rendelesController.createRendeles);
router.put("/:id", rendelesController.updateRendeles);
router.delete("/:id", rendelesController.deleteRendeles);

// Rendelés tételek lekérdezése
router.get("/:id/tetelek", rendelesController.getRendelesTetelek);

module.exports = router;
