const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/api');

app.use(cors());
app.use(express.json());

// API útvonalak
app.use('/api', apiRoutes);

// GET /api/products - Összes termék lekérése
router.get('/products', async (req, res) => {
  try {
    const termekek = await Termek.findAll();
    res.json(termekek);
  } catch (error) {
    console.error('Hiba a termékek lekérése során:', error);
    res.status(500).json({ error: 'Szerver hiba történt' });
  }
});

module.exports = router;
