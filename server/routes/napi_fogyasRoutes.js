const express = require("express");
const router = express.Router();
const napi_fogyasController = require("../Controller/napi_fogyasController");

router.get("/", napi_fogyasController.getAllNapiFogyas);
router.get("/:id", napi_fogyasController.getNapiFogyasById);
router.post("/", napi_fogyasController.createNapiFogyas);
router.put("/:id", napi_fogyasController.updateNapiFogyas);
router.delete("/:id", napi_fogyasController.deleteNapiFogyas);

module.exports = router;
