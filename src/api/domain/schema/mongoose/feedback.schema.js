const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
    {
        user_id: {
            type: String,
            required: true,
            trim: true,
        },
        entity_id: {
            type: String,
            required: false,
        },
        entity_type: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: true,
        },
        create_at: {
            type: Date,
            default: Date.now,
            required: true,
        }
    },
    {
        versionKey: false,
        collection: 'feedback',
    }
);

// Optionally, add an auto-increment plugin for 'id' if needed

module.exports = mongoose.model('feedback', feedbackSchema);