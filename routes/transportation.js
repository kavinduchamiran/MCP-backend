const express = require('express');
const router = express.Router();

const {
    createTransportation,
    updateTransportation,
    getTransportation,
    getTransportationByUser,
    createTransportationSale,
    updateTransportationSale
} = require('../controllers/TransportationController');

router.post('/createTransportation', createTransportation);

router.post('/updateTransportation', updateTransportation);

router.post('/getTransportation', getTransportation);

router.post('/getTransportationByUser', getTransportationByUser);

router.post('/createTransportationSale', createTransportationSale);

router.post('/updateTransportationSale', updateTransportationSale);

module.exports = router;

