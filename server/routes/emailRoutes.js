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

// Kapcsolati űrlap e-mail küldése
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validáció
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Minden kötelező mezőt ki kell tölteni' });
    }
    
    // E-mail küldése
    const result = await emailService.sendContactFormEmail({
      name,
      email,
      phone,
      subject,
      message
    });
    
    if (result.error) {
      return res.status(500).json({ message: 'Hiba történt az e-mail küldése során', error: result.error });
    }
    
    res.status(200).json({ message: 'Az üzenetet sikeresen elküldtük' });
  } catch (error) {
    console.error('Hiba a kapcsolati űrlap feldolgozása során:', error);
    res.status(500).json({ message: 'Szerver hiba', error: error.message });
  }
});


module.exports = router;
