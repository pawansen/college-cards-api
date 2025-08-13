const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'published',
        },
        create_at: {
            type: Date,
            default: Date.now,
            required: true,
        }
    },
    {
        versionKey: false,
        collection: 'contents',
    }
);

module.exports = mongoose.model('contents', contentSchema);