const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CitySchema = new Schema({
    id: {
        type: Number,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    state_id: {
        type: Number,
        required: false
    },
    state_code: {
        type: String,
        required: false
    },
    state_name: {
        type: String,
        required: false
    },
    country_id: {
        type: Number,
        required: false
    },
    country_code: {
        type: String,
        required: false
    },
    country_name: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
    isDisplay: {
        type: String,
        enum: ['yes', 'no'],
        required: false,
        default: 'no'
    },
    wikiDataId: {
        type: String,
        required: false
    },
    create_at: {
        type: Date,
        default: Date.now,
        required: false
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('cities', CitySchema);
