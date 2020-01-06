const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserFavouriteSchema = new Schema({
    favouriterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favouritedId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = UserFavourite = mongoose.model("UserFavourite", UserFavouriteSchema);
