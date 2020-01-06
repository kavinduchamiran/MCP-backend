// const path = require('path');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const User = require('../models/User');
const Transportation = require('../models/Transportation');
const TransportationSale = require('../models/TransportationSale');

const createTransportation = async (req, res) => {
    const {
        type,
        ownerid,
        seats,
        vehiclenumber,
        driver,
        drivercontact,
    } = req.headers;

    let image;
    if (req.files)
        image = req.files.image

    if (!(type && ownerid && seats && vehiclenumber))
        return res.status(400).json('Bad request');

    try {
        let newTransportation = new Transportation({
            type,
            ownerId: ownerid,
            seats,
            vehicleNumber: vehiclenumber,
            driver,
            driverContact: drivercontact,
            verified: true,
        });

        let result = await newTransportation.save();

        if (image)
            image.mv(`./static/transportation/${result.id}/0.jpg`);

        if (result){
            let response = {
                status: true,
                transportationId: result.id
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Transportation could not be saved'
            });
        }
    }catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const updateTransportation = async (req, res) => {
    const {transportationId, transportation} = req.body;

    if (!(transportationId))
        return res.status(400).json('Bad request');

    let images;
    if (req.files)
        images = req.files;

    if (images) {
        Object.keys(images).map((key, index) => {
            let image = images[key];
            image.mv(`./static/transportation/${transportationId}/${index}.jpg`);
        });
    }

    try {
        let result = await Transportation.findByIdAndUpdate(ObjectId(transportationId), transportation).exec();

        if (result){
            let response = {
                status: true,
                changes: transportation
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Transportation not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const getTransportation = async (req, res) => {
    const { transportationId } = req.body;

    if (!transportationId)
        return res.status(400).json('Bad request');

    try {
        let transportation = await Transportation.findById(ObjectId(transportationId)).exec();

        let owner = await User.findById(ObjectId(transportation.ownerId)).exec();

        if (transportation && owner){
            let response = {
                status: true,
                transportation,
                owner
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Transportation could not be found'
            });
        }
    }catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const getTransportationByUser = async (req, res) => {
    const { userId } = req.body;

    if (!userId)
        return res.status(400).json('Bad request');

    try {
        let transportation = await Transportation.find({ownerId: ObjectId(userId)}).exec();

        let owner = await User.findById(ObjectId(userId)).exec();

        if (transportation && owner){
            let response = {
                status: true,
                transportation: transportation[0],
                owner
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Transportation could not be found'
            });
        }
    }catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const createTransportationSale = async (req, res) => {
    const {
        buyerId,
        sellerId,
        transportationId,
        amount,
        duration,
        rating
    } = req.body;

    if (!(buyerId && sellerId && transportationId && duration))
        return res.status(400).json('Bad request');

    try {
        let newTransportationSale = new TransportationSale({
            buyerId,
            sellerId,
            transportationId,
            amount,
            duration,
            rating
        });

        let result = await newTransportationSale.save();

        if (result){
            let response = {
                status: true,
                transportationSaleId: result.id
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'TransportationSale could not be saved'
            });
        }
    }catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const updateTransportationSale = async (req, res) => {
    const {transportationSaleId, transportationSale} = req.body;

    if (!(transportationSaleId))
        return res.status(400).json('Bad request');

    try {
        let result = await TransportationSale.findByIdAndUpdate(ObjectId(transportationSaleId), transportationSale).exec();

        if (result){
            let response = {
                status: true,
                changes: transportationSale
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'TransportationSale not found'
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
    createTransportation,
    updateTransportation,
    getTransportation,
    getTransportationByUser,
    createTransportationSale,
    updateTransportationSale
};
