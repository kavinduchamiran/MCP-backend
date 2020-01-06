const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FKValidator = require('../utils/middleware/FKValidator');

const TransportationSchema = new Schema({
    type: {
        type: String,
        // accm = accomodation, taxi = transportation
        enum: ['CAR', 'VAN', 'TRUCK', 'JEEP', 'SUV'],
        required: true
    },
    ownerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
        validate: {
            validator: function(v) {
                return FKValidator(mongoose.model('User'), v);
            },
            message: `User doesn't exist`
        }
    },
    seats: {
        type: Number,
        default: 1,
        required: true
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    driver: {
        type: Boolean,
        default: true
    },
    driverContact: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = Transportation = mongoose.model("Transportation", TransportationSchema);
