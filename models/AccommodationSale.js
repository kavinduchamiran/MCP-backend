const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FKValidator = require('../utils/middleware/FKValidator');

const AccommodationSaleSchema = new Schema({
    buyerId: {
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
    sellerId: {
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
    accommodationId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Accommodation',
        validate: {
            validator: function(v) {
                return FKValidator(mongoose.model('Accommodation'), v);
            },
            message: `Accommodation doesn't exist`
        },
        required: true
    },
    amount: {
        type: Number,
        default: 1
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        required: true
    },
    driverContact: {
        type: [Number],
    },
    status: {
        type: String,
        default: 'INIT',
        enum: ['INIT', 'PROCESSING', 'DELIVERED']
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    }
});

module.exports = AccommodationSale = mongoose.model("AccommodationSale", AccommodationSaleSchema);
