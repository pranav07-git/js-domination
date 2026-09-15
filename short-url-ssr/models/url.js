const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        rquired: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        rquired: true,
    },
    visitedHistory: [{timestamp: { type: Number}}]
}, {timestamps: true});

const URL = mongoose.model("url", urlSchema);

module.exports = URL;