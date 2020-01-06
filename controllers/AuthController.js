const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const User = require("../models/User");

const userKey = 'kavindu';

const register = async (req, res) => {
    const {
        name,
        gender,
        birthday,
        nationality,
        language,
        type,
        email,
        password
    } = req.body;

    let birthdayObj = new Date(birthday);

    const year = birthdayObj.getFullYear(),
        month = birthdayObj.getMonth() + 1,
        day = birthdayObj.getDate();

    // todo image
    if (!(name && gender && birthday && nationality && language && type && email && password))
        return res.status(400).json('Bad request');

    User.findOne({ email }).then(user => {
        if (user) {
            return res.status(400).json({
                status: false,
                errors: "Email already exists"
            });

        } else {
            const newUser = new User({
                name,
                gender,
                birthday: {
                    year,
                    month,
                    day
                },
                nationality,
                language,
                type,
                email,
                password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;

                    newUser
                        .save()
                        .then(user => res.status(200).json({
                                status: true,
                                id: user.id
                            })
                        )
                        .catch(err => res.status(400).json({
                            status: false,
                            errors: err.errors || err.message
                        }));
                });
            });
        }
    });
};

const login = async (req, res) => {
    const {email, password, socialMediaId, socialMediaToken} = req.body;

    if (!((email && password) || (socialMediaId && socialMediaToken)))
        return res.status(400).json('Bad request');

    User.findOne({ email }).then(async user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({
                status: false,
                errors: "User not found"
            });
        }

        if (user && user.deleted) {
            return res.status(404).json({
                status: false,
                errors: "User account deleted"
            });
        }

        if (user && !user.activated) {
            return res.status(404).json({
                status: false,
                errors: "Awaiting user activation"
            });
        }

        const {id, type, name} = user;

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id,
                    email
                };

                jwt.sign(
                    payload,
                    userKey,
                    {
                        expiresIn: '24h' // 1 day
                    },
                    (err, token) => {
                        res.json({
                            status: true,
                            user: {
                                id,
                                name,
                                type,
                                email,
                                token
                            }
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({
                        status: false,
                        errors: "Password incorrect"
                    });
            }
        });
    });
};

const validateUsername = async (req, res) => {
    const {username} = req.body;

    if (!username)
        return res.status(400).json('Bad request');

    try {
        let user = await User.find({username}).exec();

        if (user && user.length) {
            let response = {
                status: true,
                isValid: true
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Invalid username'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

module.exports = {
    register,
    login,
    validateUsername
};
