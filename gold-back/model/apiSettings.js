const mongoose = require('mongoose');

const apiSettingsSchema = new mongoose.Schema({
    goldApi: {
        apiKey: {
            type: String,
            default: 'B3HsYAYhzDQsmPdg2s9QPHQmlkWG1HGu'
        },
        apiUrl: {
            type: String,
            default: 'https://Api.BrsApi.ir/Market/Gold_Currency.php?key='
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastUpdate: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true
});

// فقط یک سند تنظیمات باید وجود داشته باشه
apiSettingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = new this();
        await settings.save();
    }
    return settings;
};

module.exports = mongoose.model('ApiSettings', apiSettingsSchema);
