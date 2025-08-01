const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['subscription', 'custom'],
            default: 'custom',
        },
        is_read: {
            type: Boolean,
            default: false,
        },
        create_at: {
            type: Date,
            default: Date.now,
            required: true,
        },
        read_at: {
            type: Date,
        },
        data: {
            type: Schema.Types.Mixed,
        },
        entity_id: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        priority: {
            type: Number,
            default: 0,
        }
    },
    {
        versionKey: false,
        collection: 'notification',
    }
);

// Optionally, add an auto-increment plugin for 'id' if needed

module.exports = mongoose.model('notification', notificationSchema);