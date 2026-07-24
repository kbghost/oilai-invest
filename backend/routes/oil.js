const express = require('express');
const { getCurrentOilData, getOilNews } = require('../controllers/oilController');

const router = express.Router();

router.get('/price', getCurrentOilData);
router.get('/news', getOilNews);

module.exports = router;
