const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares').requireAuth;

const questionSetsController = require('../controllers/questionSetsController');

router.use(requireAuth);

router.get('/', questionSetsController.getQuestionSets);
router.post('/', questionSetsController.createQuestionSet);


module.exports = router;