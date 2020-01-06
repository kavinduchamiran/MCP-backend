const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require('validator');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [6, 'Name too short'],
        maxlength: [15, 'Name too long']
    },
    joiningDate: {
        type: Date,
        default: Date.now
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE", "OTHER"],
        required: true
    },
    birthday: {
        year: {
            type: Number,
            min: [1950, 'Invalid birthday'],
            max: [2019, 'Invalid birthday']
        },
        month: {
            type: Number,
            min: [1, 'Invalid birthday'],
            max: [12, 'Invalid birthday']
        },
        day: {
            type: Number,
            min: [1, 'Invalid birthday'],
            max: [31, 'Invalid birthday']
        }
    },
    nationality: {
        type: String,
        enum: ['US', 'UK', 'AU'],
        required: true
    },
    language: {
        type: String,
        enum: ['EN', 'DU', 'IT', 'FR'],
        required: true,
    },
    type: {
        type: String,
        enum: ['HAN', 'TRA', 'ACC'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [ isEmail, 'Invalid Email' ]
    },
    password: {
        type: String,
        minlength: [8, 'Password too short'],
    },
    pushToken: {
        type: String
    },
    activated: {
        type: Boolean,
        default: false
    },
    dateDeleted: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        default: 5
    },
    chatId: String
});

module.exports = User = mongoose.model("User", UserSchema);
