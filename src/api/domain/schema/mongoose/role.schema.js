const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema(
    {
        role_name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        can_edit: {
            type: Number,
            required: true,
            default: 1,
        },
        create_at: {
            type: Date,
            default: Date.now,
            required: true,
        },
        update_at: {
            type: Date,
            default: Date.now,
            required: true,
        },
    },
    {
        versionKey: false,
        collection: 'roles',
    }
);

// Optionally, add an auto-increment plugin for 'id' if needed

module.exports = mongoose.model('roles', roleSchema);

