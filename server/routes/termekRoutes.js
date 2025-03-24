const express = require("express");
const router = express.Router();
const termekController = require("../Controller/termekController");

router.get("/", termekController.getAllTermek);
router.get("/:id", termekController.getTermekById);
router.post("/", termekController.createTermek);
router.put("/:id", termekController.updateTermek);
router.delete("/:id", termekController.deleteTermek);

module.exports = router;
