const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares').requireAuth;


const answersController = require('../controllers/answersController');

router.use(requireAuth);

router.get('/', answersController.getAllAnswers);
router.post('/', answersController.createAnswers);
router.get('/:id', answersController.getAnswer);
router.get('/match/:asker/:askee', answersController.matchAnswers);
router.delete('/:id', answersController.deleteAnswer);
router.get('/relationship/:id', answersController.getAnswersForRelationship);
module.exports = router;