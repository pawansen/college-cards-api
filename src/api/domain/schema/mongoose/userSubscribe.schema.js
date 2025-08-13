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
    city_ids: {
        type: [Number],
        required: false
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
    isAutoRenew: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
        default: 'yes'
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
        enum: ['active', 'inactive', 'cancelled', 'expired', 'cancelledUsedFullMonth'],
        required: true,
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedDate: {
        type: Date,
        required: false
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('user_subscribes', UserSubscribeSchema);
