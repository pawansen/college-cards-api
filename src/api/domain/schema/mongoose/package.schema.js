const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PackageSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    cityCount: {
        type: Number,
        required: false
    },
    amount: {
        type: Number,
        required: false
    },
    packageType: {
        type: String,
        enum: ['monthly', 'yearly', 'day', 'week'],
        required: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    create_at: {
        type: Date,
        default: Date.now,
        required: false
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('packages', PackageSchema);
