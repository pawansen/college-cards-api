const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSubscribeSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    package_id: {
        type: String,
        required: true
    },
    payment_id: {
        type: String,
        required: false
    },
    cityCount: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    packageType: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('user_subscribes', UserSubscribeSchema);
