const express = require('express');
const router = express.Router();

const {
    createAccommodation,
    updateAccommodation,
    createAccommodationSale,
    updateAccommodationSale
} = require('../controllers/AccommodationController');

router.post('/createAccommodation', createAccommodation);

router.post('/updateAccommodation', updateAccommodation);

router.post('/createAccommodationSale', createAccommodationSale);

router.post('/updateAccommodationSale', updateAccommodationSale);

module.exports = router;

