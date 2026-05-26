const express = require('express');
const apiSettingsController = require('../controller/apiSettingsController');
const isuser = require('../Middleware/isuser');

const router = express.Router();

// مسیرهای مدیریت تنظیمات API
router.get('/settings', isuser, apiSettingsController.getSettings);
router.post('/settings', isuser, apiSettingsController.updateSettings);
router.post('/test', isuser, apiSettingsController.testApi);
router.get('/status', isuser, apiSettingsController.getApiStatus);

module.exports = router;
