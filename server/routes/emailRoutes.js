const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// Regisztrációs visszaigazoló e-mail küldése
router.post('/registration-confirmation', async (req, res) => {
  try {
    const { email, username } = req.body;
    
    if (!email || !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hiányzó adatok: e-mail cím vagy felhasználónév' 
      });
    }
    
    const result = await emailService.sendRegistrationConfirmation({ email, username });
    
    if (result.error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Hiba történt az e-mail küldése során', 
        error: result.error 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Regisztrációs e-mail sikeresen elküldve' 
    });
  } catch (error) {
    console.error('Hiba a regisztrációs e-mail küldésekor:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Szerverhiba történt', 
      error: error.message 
    });
  }
});

module.exports = router;
