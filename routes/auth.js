const express = require('express');
const router = express.Router();

const {
    register,
    login,
    validateUsername
} = require('../controllers/AuthController');

router.post('/register', register);

router.post('/login', login);

router.post('/validateUsername', validateUsername);

module.exports = router;

