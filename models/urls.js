const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        requried: true,
        unique: true
    },
    longUrl: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Url', urlSchema);
// This schema defines the structure of the URL documents in the MongoDB database.