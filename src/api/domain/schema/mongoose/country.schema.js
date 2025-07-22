const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    iso3: {
        type: String,
        required: true
    },
    iso2: {
        type: String,
        required: true
    },
    numeric_code: {
        type: String,
        required: true
    },
    phonecode: {
        type: String,
        required: true
    },
    capital: {
        type: String
    },
    currency: {
        type: String
    },
    currency_name: {
        type: String
    },
    currency_symbol: {
        type: String
    },
    tld: {
        type: String
    },
    native: {
        type: String
    },
    region: {
        type: String
    },
    region_id: {
        type: Number
    },
    subregion: {
        type: String
    },
    subregion_id: {
        type: Number
    },
    nationality: {
        type: String
    },
    timezones: [
        {
            zoneName: String,
            gmtOffset: Number,
            gmtOffsetName: String,
            abbreviation: String,
            tzName: String
        }
    ],
    translations: {
        type: Map,
        of: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    emoji: {
        type: String
    },
    emojiU: {
        type: String
    },
    create_at: {
        type: Date,
        default: Date.now,
        required: false
    }
});

module.exports = mongoose.model('countries', CountrySchema);
