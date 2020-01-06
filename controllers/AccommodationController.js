// const path = require('path');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const Accommodation = require('../models/Accommodation');
const AccommodationSale = require('../models/AccommodationSale');

const createAccommodation = async (req, res) => {
    const {
        type,
        ownerId,
        capacity,
        address,
        tel,
        verified,
    } = req.body;

    if (!(type && ownerId && address && tel))
        return res.status(400).json('Bad request');

    try {
        let newAccommodation = new Accommodation({
            type,
            ownerId,
            capacity,
            address,
            tel,
            verified,
        });

        let result = await newAccommodation.save();

        if (result){
            let response = {
                status: true,
                accommodationId: result.id
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Accommodation could not be saved'
            });
        }
    }catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const updateAccommodation = async (req, res) => {
    const {accommodationId, accommodation} = req.body;

    if (!(accommodationId))
        return res.status(400).json('Bad request');

    let images;
    if (req.files)
        images = req.files;

    if (images) {
        Object.keys(images).map((key, index) => {
            let image = images[key];
            image.mv(`./static/accommodation/${accommodationId}/${index}.jpg`);
        });
    }

    try {
        let result = await Accommodation.findByIdAndUpdate(ObjectId(accommodationId), accommodation).exec();

        if (result){
            let response = {
                status: true,
                changes: accommodation
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Accommodation not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const createAccommodationSale = async (req, res) => {
    const {
        buyerId,
        sellerId,
        accommodationId,
        amount,
        duration,
        rating
    } = req.body;

    if (!(buyerId && sellerId && accommodationId && duration))
        return res.status(400).json('Bad request');

    try {
        let newAccommodationSale = new AccommodationSale({
            buyerId,
            sellerId,
            accommodationId,
            amount,
            duration,
            rating
        });

        let result = await newAccommodationSale.save();

        if (result){
            let response = {
                status: true,
                accommodationSaleId: result.id
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'AccommodationSale could not be saved'
            });
        }
    }catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const updateAccommodationSale = async (req, res) => {
    const {accommodationSaleId, accommodationSale} = req.body;

    if (!(accommodationSaleId))
        return res.status(400).json('Bad request');

    try {
        let result = await AccommodationSale.findByIdAndUpdate(ObjectId(accommodationSaleId), accommodationSale).exec();

        if (result){
            let response = {
                status: true,
                changes: accommodationSale
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'AccommodationSale not found'
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
    createAccommodation,
    updateAccommodation,
    createAccommodationSale,
    updateAccommodationSale
};
