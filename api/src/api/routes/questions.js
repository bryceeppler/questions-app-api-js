const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares').requireAuth;


const questionsController = require('../controllers/questionsController');
router.use(requireAuth);

router.get('/', questionsController.getAllQuestions);
router.post('/', questionsController.createQuestions);
router.get('/:id', questionsController.getQuestion);
router.get('/getQuestions/:ids', questionsController.getQuestions);
router.delete('/:id', questionsController.deleteQuestion);
router.get('/get_by_date_for_relationship/:startDate/:endDate/:relationshipId', questionsController.getQuestionsByDateForRelationship);
router.get('/get_data_for_relationship/:relationshipId', questionsController.getQuestionsDataForRelationship);

module.exports = router;