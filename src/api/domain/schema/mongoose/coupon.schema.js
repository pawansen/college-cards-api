const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CouponSchema = new Schema({
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
        required: false
    },
    description: {
        type: String,
        required: false
    },
    city_id: {
        type: String,
        required: false
    },
    address: [
        {
            address: { type: String, required: false }
        }
    ],
    logo: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true,
    },
    create_at: {
        type: Date,
        default: Date.now,
        required: false
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('coupons', CouponSchema);
