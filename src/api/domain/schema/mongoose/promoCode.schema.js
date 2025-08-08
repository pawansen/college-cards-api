const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PromoCodeSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false
    },
    amount: {
        type: String,
        required: false
    },
    amountType: {
        type: String,
        enum: ['percentage', 'amount'],
        required: false,
        default: 'percentage'
    },
    maxUsagePerUser: {
        type: Number,
        required: false
    },
    totalUsageLimit: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
        required: false
    },
    validFrom: {
        type: Date,
        required: false
    },
    validTo: {
        type: Date,
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

module.exports = mongoose.model('promo_codes', PromoCodeSchema);
