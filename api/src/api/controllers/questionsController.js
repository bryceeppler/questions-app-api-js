const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();

const populate = (req, res) => {
    // This function is to populate the database with a test question set
    // This is the first question set
    const questionSetId = 1;
    const questionList = [
        "1. What was your first impression of me, and how does it differ from how you see me now?",
        "2. What’s one thing you wish we did more of?",
        "3. How would you describe me to a stranger?",
        "4. What could I teach a stranger?",
        "5. What’s one thing you don’t know about me that you wish you did?",
        "6. What do you think brought us closer?",
        "7. What is something you think I could benefit from learning?",
        "8. What is my superpower?",
        "9. What’s one thing about yourself you wish I knew?",
        "10. If I had an alternate life, where would I live and what would I do for work?",
        "11. What is something younger you would be in disbelief of of you now?",
        "12. What’s something you always thought you would do when you were younger that you haven’t yet? How come?",
        "13. Tell me something you want to accomplish in the next 8 months. How can I help you accomplish that?",
        "14. (without looking) What’s my phone wallpaper, and what does that say about me?",
        "15. What surprises you about me?",
        "16. Quick! What’s your go-to comfort movie, song, show? Why does it make you feel better?"
    ]

    // Create a question for each question in the list
    // This is a promise array so that we can wait for all of them to finish before sending the response
    const promiseArray = questionList.map((questionText) => {
        return prisma.Question.create({
            data: {
                text :  questionText,
                questionSetId,
            }
        })
    })

    // Wait for all of the promises to finish
    // Then send the response
    Promise.all(promiseArray).then((questions) => {
        res.json(questions);
    })

}

const getQuestionsDataForRelationship = (req, res) => {
  const { relationshipId } = req.params;

  prisma.Answer.findMany({
    where: {
      relationshipId: Number(relationshipId),
    },
    include: {
      question: true,
    },
  }).then((answers) => {
    // for each answer, join them to a new question object with a matching questionId
    const questions = {};
    answers.forEach((answer) => {
      const question = answer.question;
      const questionId = question.id;

      if (!questions[questionId]) {
        questions[questionId] = {
          questionId: questionId,
          question: question.text,
          askedAt: question.askedAt,
          answers: [],
        };
      }
      questions[questionId].answers.push({
        answerId: answer.id,
        answer: answer.text,
        answeredAt: answer.createdAt,
        userId: answer.userId,
        createdAt: answer.createdAt,
      });
    });
    // turn questions object into array
    const questionsArray = Object.values(questions);
    res.json(questionsArray);
  });
};

const getQuestionsByDateForRelationship = (req, res) => {
  const { startDate, endDate, relationshipId } = req.params;
  // end date is exclusive, so add 1 day to it
  const endDatePlusOne = new Date(endDate);
  endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);

  prisma.Answer.findMany({
    where: {
      relationshipId: Number(relationshipId),
      createdAt: {
        gte: new Date(startDate),
        lte: endDatePlusOne,
      },
    },
    include: {
      question: true,
    },
  }).then((answers) => {
    // for each answer, join them to a new question object with a matching questionId
    const questions = {};
    answers.forEach((answer) => {
      const question = answer.question;
      const questionId = question.id;

      if (!questions[questionId]) {
        questions[questionId] = {
          questionId: questionId,
          question: question.text,
          askedAt: question.askedAt,
          answers: [],
        };
      }
      questions[questionId].answers.push({
        answerId: answer.id,
        answer: answer.text,
        answeredAt: answer.createdAt,
        userId: answer.userId,
        createdAt: answer.createdAt,
      });
    });
    res.json(questions);
  });
};

const getAllQuestions = (req, res) => {
  prisma.Question.findMany().then((questions) => {
    res.json(questions);
  });
};

const createQuestions = (req, res) => {
  prisma.Question.create({
    data: {
      ...req.body,
      createdAt: new Date(),
    },
  }).then((question) => {
    res.json(question);
  });
};

const getQuestion = (req, res) => {
  const { id } = req.params;
  prisma.Question.findUnique({
    where: {
      question_id: Number(id),
    },
  }).then((question) => {
    res.json(question);
  });
};

const getQuestions = (req, res) => {
  const { ids } = req.params;
  // make idArray of ints from id
  const idArray = ids.split(",").map((id) => Number(id));
  prisma.Question.findMany({
    where: {
      question_id: {
        in: idArray,
      },
    },
  }).then((questions) => {
    res.json(questions);
  });
};

const deleteQuestion = (req, res) => {
  const { id } = req.params;
  prisma.Question.delete({
    where: {
      question_id: Number(id),
    },
  }).then((question) => {
    res.json(question);
  });
};

module.exports = {
  getAllQuestions,
  createQuestions,
  getQuestion,
  getQuestions,
  deleteQuestion,
  getQuestionsByDateForRelationship,
  getQuestionsDataForRelationship,
    populate,
};
