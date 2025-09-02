const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 */
const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        mobile: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        countryCode: {
            type: String,
            required: false,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        grant: {
            type: String,
            required: true,
        },
        auth_password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'moderator'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Number,
            default: 0,
            required: false,
        },
        isMobileVerified: {
            type: Number,
            default: 0,
            required: false,
        },
        lastLoginAt: {
            type: String,
            required: false,
            default: null,
        },
        lastLoginIp: {
            type: String,
            required: false,
            default: null,
        },
        isNotificationSent: {
            type: Number,
            default: 0,
            required: false,
        },
        otp: {
            type: Number,
            default: 0,
            required: false,
        },
        otpExpireTime: {
            type: Date,
            default: null,
            trim: true,
        },
        deviceId: {
            type: String,
            required: false,
            default: null,
        },
        deviceType: {
            type: String,
            enum: ['android', 'ios', 'web'],
            default: 'android',
        },
        deviceToken: {
            type: String,
            required: false,
            default: null,
        },
        loginType: {
            type: String,
            enum: ['app', 'social', 'web'],
            default: 'app',
        },
        socialType: {
            type: String,
            enum: ['facebook', 'app', 'apple', 'google', 'twitter', 'linkedin'],
            default: 'app',
        },
        socialId: {
            type: String,
            required: false,
            default: null,
        },
        referralCode: {
            type: String,
            required: false,
            default: null,
        },
        referredBy: {
            type: String,
            required: false,
            default: null,
        },
        referralLink: {
            type: String,
            required: false,
            default: null,
        },
        updatedDate: {
            type: Date,
            default: null,
            trim: true,
        },
        createDate: {
            type: Date,
            default: Date.now,
            trim: true,
        },
        // Optional extra fields
        profileImage: {
            type: String,
            default: null,
        },
        address: {
            street: { type: String, default: null },
            city: { type: String, default: null },
            state: { type: String, default: null },
            zip: { type: String, default: null },
            country: { type: String, default: null },
        }
    },
    {
        versionKey: false,
        timestamps: false, // You can use true to auto-manage createdAt, updatedAt
        collection: 'users',
    }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('users', userSchema);
