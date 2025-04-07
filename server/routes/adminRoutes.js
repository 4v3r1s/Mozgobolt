const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Napi fogyás management routes
router.get('/napi-fogyas', adminController.getAllNapiFogyas);
router.get('/napi-fogyas/:id', adminController.getNapiFogyasById);
router.put('/napi-fogyas/:id', adminController.updateNapiFogyas);
router.delete('/napi-fogyas/:id', adminController.deleteNapiFogyas);

module.exports = router;