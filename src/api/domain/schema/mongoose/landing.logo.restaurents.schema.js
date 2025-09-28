const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LandingLogoRestaurentsSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    city_id: {
        type: Number,
        required: false
    },
    logo: {
        type: String,
        required: false
    },
    is_display_nine: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no',
    },
    is_featured: {
        type: String,
        enum: ['yes', 'no'],
        default: 'no',
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

module.exports = mongoose.model('landing_logo_restaurents', LandingLogoRestaurentsSchema);
