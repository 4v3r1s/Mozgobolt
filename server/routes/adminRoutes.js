const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');



// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;