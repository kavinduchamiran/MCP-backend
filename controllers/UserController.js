const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const speech = require('@google-cloud/speech').v1p1beta1;
const stringSimilarity = require('string-similarity');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const client = new speech.SpeechClient();

const User = require('../models/User');
const UserReport = require('../models/UserReport');
const UserFavourite = require('../models/UserFavourite');

let verificationTexts = {
    EN: 'Times Square is the hub of the Broadway theatre district and a major cultural venue in Midtown Manhattan, New York City. The pedestrian intersection also have one of the highest annual attendance-rates of any tourist attraction in the world, estimated at 60 million.',
    DU: 'Times Square is het centrum van het theaterdistrict Broadway en een belangrijke culturele locatie in Midtown Manhattan, New York City. De voetgangersoversteekplaats heeft ook een van de hoogste jaarlijkse bezoekerspercentages van alle toeristische attracties ter wereld, geschat op 60 miljoen.',
    IT: 'Times Square è il fulcro del quartiere dei teatri di Broadway e un\'importante sede culturale a Midtown Manhattan, New York City. L\'incrocio pedonale ha anche uno dei più alti tassi di frequenza annuale di qualsiasi attrazione turistica nel mondo, stimato in 60 milioni.',
    FR: 'Times Square est le centre du quartier des théâtres de Broadway et un lieu culturel majeur à Midtown Manhattan, à New York. L\'intersection piétonne présente également l\'un des taux de fréquentation annuels les plus élevés de toutes les attractions touristiques au monde, estimé à 60 millions.'
};

const languageCodes = {
    'EN': 'en-US',
    'FR': 'fr-FR',
    'DU': 'nl-NL',
    'IT': 'it-IT'
}

const getUser = async (req, res) => {
    const {userId} = req.body;

    if (!userId)
        return res.status(400).json('Bad request');

    try {
        let user = await User.findById(ObjectId(userId), {
            id: 1,
            username: 1,
            email: 1,
            nationality: 1,
            languages: 1,
            gender: 1,
            birthday: 1,
            type: 1,
            rating: 1,
            chatId: 1
        }).exec();

        if (user){
            let response = {
                status: true,
                user,
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'User not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const updateUser = async (req, res) => {
    const {userId, user} = req.body;

    if (!(userId && user))
        return res.status(400).json('Bad request');

    try {
        let result = await User.findByIdAndUpdate(ObjectId(userId), user).exec();

        if (result){
            let response = {
                status: true,
                changes: user
            };

            let image;
            if (req.files)
                image = req.files.image;

            if (image) {
                // todo see if update returns user.username
                image.mv(`./static/user/${userId}.jpg`);
            }

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'User not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    const {userId} = req.body;

    if (!userId)
        return res.status(400).json('Bad request');

    try {
        let user = await User.findById(ObjectId(userId)).exec();

        if (user.deleted)
            return res.status(400).json({
                status: false,
                errors: 'User already deleted'
            });

        let dateDeleted = new Date().toISOString();
        let deletedUser = await User.findByIdAndUpdate(ObjectId(userId), {
            dateDeleted: dateDeleted,
            deleted: true
        }).exec();

        if (deletedUser){
            let response = {
                status: true,
                dateDeleted: dateDeleted,
                userId: deletedUser.id
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'User not found'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const reportUser = async (req, res) => {
    const {reason, reporterId, reportedId, comment} = req.body;

    if (!(reason && reporterId && reportedId && comment))
        return res.status(400).json('Bad request');

    try {
        let userReport = new UserReport({
            reporterId: ObjectId(reporterId),
            reportedId: ObjectId(reportedId),
            reportReason: reason,
            comment: comment
        });

        let result = await userReport.save();

        if (result){
            let response = {
                status: true,
                date: new Date().toISOString(),
                userId: reporterId
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Report could not be saved'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const favouriteUser = async (req, res) => {
    // todo handle duplicate follows

    const {favouriterId, favouritedId} = req.body;

    if (!(favouriterId && favouritedId))
        return res.status(400).json('Bad request');

    try {

        let favouritedUser = new UserFavourite({
            favouriterId,
            favouritedId
        });

        let result = await favouritedUser.save();

        if (result){
            let response = {
                status: true
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Error saving user favourited'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const registerPush = async (req, res) => {
    const {userId, pushToken} = req.body;

    if (!(userId && pushToken))
        return res.status(400).json('Bad request');

    try {
        let result = await new UserToken({
            userId: ObjectId(userId),
            token: pushToken
        }).save();

        if (result) {
            let response = {
                status: true,
                date: new Date().toISOString(),
                userId: userId
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                errors: 'Error saving user token'
            });
        }
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

const verifyLanguage = async (req, res) => {
    console.log('Processing request');
    const {audio} = req.files;
    let filename = audio.name;

    const {language, userid} = req.headers;

    let languageCode = languageCodes[language];

    let filePath = `./static/audio/${filename}`;
    let encFilePath = `./static/audio/${filename}.enc`;

    if (!audio)
        return res.status(400).json('Bad request');

    try {
        audio.mv(filePath, () => {
            ffmpeg()
                .input(filePath)
                .outputOptions([
                    '-f s16le',
                    '-acodec pcm_s16le',
                    '-vn',
                    '-ac 1',
                    '-ar 41k',
                    '-map_metadata -1'
                ])
                // here we save our result to the encodedPath we declared above
                .save(encFilePath)
                .on('end', async () => {
                    // after the file is saved we read it
                    const savedFile = fs.readFileSync(encFilePath);

                    if (!savedFile) {
                        res.status(400).json({
                            status: false,
                            errors: 'File can not be read'
                        });
                    }

                    const audioBytes = savedFile.toString('base64');
                    const audio = {
                        content: audioBytes,
                    };

                    const sttConfig = {
                        // if you need punctuation set to true
                        enableAutomaticPunctuation: false,
                        encoding: "LINEAR16",
                        sampleRateHertz: 41000,
                        languageCode: languageCode,
                        model: "default"
                    };

                    const request = {
                        audio: audio,
                        config: sttConfig,
                    };

                    const [response] = await client.recognize(request);
                    if (!response) {
                        res.status(400).json({
                            status: false,
                            errors: 'No response from GCP'
                        });
                    }

                    const transcript = response.results
                        .map(result => result.alternatives[0].transcript)
                        .join('\\n');

                    let similarity = stringSimilarity.compareTwoStrings(verificationTexts[language], transcript);

                    console.log(similarity);

                    fs.unlinkSync(filePath);
                    fs.unlinkSync(encFilePath);

                    if (similarity > 0.3) {
                        await User.findByIdAndUpdate(userid, {
                            activated: true
                        }).exec();

                        res.status(200).json({
                            status: true,
                            verified: true
                        });
                    }else{
                        res.status(200).json({
                            status: true,
                            verified: false
                        });
                    }
                });
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            errors: err.message
        });
    }
};

module.exports = {
    getUser,
    updateUser,
    deleteUser,
    reportUser,
    favouriteUser,
    registerPush,
    verifyLanguage
};
