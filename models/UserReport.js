const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserReportSchema = new Schema({
    reporterId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportReason: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

module.exports = UserReport = mongoose.model("UserReport", UserReportSchema);
