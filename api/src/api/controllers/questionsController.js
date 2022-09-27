const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();

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
  prisma.Question
    .create({
      data: {
        ...req.body,
        createdAt: new Date(),
      },
    })
    .then((question) => {
      res.json(question);
    });
};

const getQuestion = (req, res) => {
  const { id } = req.params;
  prisma.Question
    .findUnique({
      where: {
        question_id: Number(id),
      },
    })
    .then((question) => {
      res.json(question);
    });
};

const getQuestions = (req, res) => {
  const { ids } = req.params;
  // make idArray of ints from id
  const idArray = ids.split(",").map((id) => Number(id));
  prisma.Question
    .findMany({
      where: {
        question_id: {
          in: idArray,
        },
      },
    })
    .then((questions) => {
      res.json(questions);
    });
};

const deleteQuestion = (req, res) => {
  const { id } = req.params;
  prisma.Question
    .delete({
      where: {
        question_id: Number(id),
      },
    })
    .then((question) => {
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
};
