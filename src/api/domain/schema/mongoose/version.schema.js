const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 */
const versionSchema = new Schema(
    {
        isCompulsoryUpdate: {
            type: String,
            enum: ['yes', 'no'],
            default: 'no',
        },
        androidVersion: {
            type: String,
            required: false,
            default: null,
        },
        iosVersion: {
            type: String,
            required: false,
            default: null,
        },
        createDate: {
            type: Date,
            default: Date.now,
            trim: true,
        },
    },
    {
        versionKey: false,
        timestamps: false,
        collection: 'versions',
    }
);

module.exports = mongoose.model('versions', versionSchema);
