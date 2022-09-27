const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const twilioController = require('../controllers/twilioController');

router.use(bodyParser.urlencoded({ extended: false }));

router.post('/dispatch_question', twilioController.dispatchQuestion);
router.post('/sms', twilioController.sms);
router.post('/send_message', twilioController.sendMessage);

module.exports = router;