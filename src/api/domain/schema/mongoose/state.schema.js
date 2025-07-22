const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StateSchema = new Schema({
    id: {
        type: Number,
        required: false
    },
    name: {
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
    state_code: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    latitude: {
        type: String,
        default: null
    },
    longitude: {
        type: String,
        default: null
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('states', StateSchema);
