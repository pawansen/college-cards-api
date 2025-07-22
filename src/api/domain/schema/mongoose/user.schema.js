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
        },
        lastLogin: {
            type: Date,
            default: null,
        },
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
