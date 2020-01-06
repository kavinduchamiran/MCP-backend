const express = require('express');
const router = express.Router();

const {
    getUser,
    updateUser,
    deleteUser,
    reportUser,
    favouriteUser,
    registerPush,
    verifyLanguage
} = require('../controllers/UserController');

router.post('/getUser', getUser);

router.post('/updateUser', updateUser);

router.post('/deleteUser', deleteUser);

router.post('/reportUser', reportUser);

router.post('/favouriteUser', favouriteUser);

router.post('/registerPush', registerPush);

router.post('/verifyLanguage', verifyLanguage);

module.exports = router;

