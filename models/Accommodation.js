const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FKValidator = require('../utils/middleware/FKValidator');

const AccommodationSchema = new Schema({
    type: {
        type: String,
        enum: ['HOTEL', 'MOTEL', 'INN', 'HOSTEL', 'BNB'],
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
    capacity: {
        type: Number,
        default: 1
    },
    address: {
        city: String,
        street: String,
        houseNumber: String
    },
    tel: {
        type: [String],
        required: true
    },
    available: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    }
});

module.exports = Accommodation = mongoose.model("Accommodation", AccommodationSchema);
