const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserCitiesSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    city_id: {
        type: Number,
        required: true
    },
    create_at: {
        type: Date,
        default: Date.now,
        required: false
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('user-cities', UserCitiesSchema);
