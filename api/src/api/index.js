const express = require('express');
const nodeCron = require('node-cron');

const questions = require('./routes/questions');
const answers = require('./routes/answers');
const users = require('./routes/users');
const relationships = require('./routes/relationships');
const twilio = require('./routes/twilio');
const questionSets = require('./routes/questionSets');
const friends = require('./routes/friends');

const askQuestionSet1 = require('./cron/askQuestionSet1');

const router = express.Router();

// CRON SCHEDULE
// Question set 1
// Mon-Thurs at 9am
nodeCron.schedule('0 9 * * 1-4', askQuestionSet1, {
  scheduled: true,
  timezone: 'America/Los_Angeles',
});

// const testCron = require('./testCron');
// router.get('/testCron', testCron);

router.get('/', (req, res) => {
  res.json({
    message: 'api/v1',
  });
});
router.use('/questionSets', questionSets);
router.use('/questions', questions);
router.use('/answers', answers);
router.use('/users', users);
router.use('/relationships', relationships);
router.use('/twilio', twilio);
router.use('/friends', friends);



module.exports = router;
