const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserPaymentsSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    package_id: {
        type: String,
        required: true
    },
    subscription_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: false
    },
    paymentMethod: {
        type: String,
        required: false
    },
    transactionId: {
        type: String,
        required: false
    },
    gateway: {
        type: String,
        required: false
    },
    receiptUrl: {
        type: String,
        required: false
    },
    refundedAmount: {
        type: Number,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    paymentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('user_payments', UserPaymentsSchema);
