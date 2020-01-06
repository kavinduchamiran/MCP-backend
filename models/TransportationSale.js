const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FKValidator = require('../utils/middleware/FKValidator');

const TransportationSaleSchema = new Schema({
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
    transportationId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Transportation',
        required: true,
        validate: {
            validator: function(v) {
                return FKValidator(mongoose.model('Transportation'), v);
            },
            message: `Transportation doesn't exist`
        }
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

module.exports = TransportationSale = mongoose.model("TransportationSale", TransportationSaleSchema);
