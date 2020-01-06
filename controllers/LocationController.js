const admin = require('firebase-admin');
const firestore = admin.firestore();

const io = require('../utils/socketio-services').getIO();

const getUserLocation = (userId) => {
    let user = firestore.collection('users').doc(userId);

    user.onSnapshot(docSnapshot => {
        io.emit('location', docSnapshot.data());
        console.log('emitted');
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
};

module.exports = {
    getUserLocation
};
