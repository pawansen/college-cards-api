const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OAuthTokenSchema = new Schema({
    user_id: {
        type: String,
        default: null
    },
    client_id: {
        type: String,
        default: null
    },
    access_token: {
        type: String,
        default: null,
        index: true
    },
    refresh_token: {
        type: String,
        default: null
    },
    access_token_expires_on: {
        type: Date,
        default: null
    },
    refresh_token_expires_on: {
        type: Date,
        default: null
    },
    user: {
        type: String,
        default: null
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
});

// Add index for user_id
OAuthTokenSchema.index({ user_id: 1 });

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema, 'oauth_tokens');
