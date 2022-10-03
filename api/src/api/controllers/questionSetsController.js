const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();

const getQuestionSetQuestions = (req, res) => {
  const { id } = req.params;
  prisma.Question.findMany({
    where: {
      questionSetId: Number(id),
    },
  }).then((questions) => {
    res.json(questions);
  });
};


const getQuestionSets = (req, res) => {
  prisma.QuestionSet.findMany().then((questionSets) => {
    res.json(questionSets);
  });
};

const createQuestionSet = (req, res) => {
  prisma.QuestionSet
    .create({
      data: {
        ...req.body,
        createdAt: new Date(),
      },
    })
    .then((questionSet) => {
      res.json(questionSet);
    });
};


module.exports = {
    getQuestionSets,
    createQuestionSet,
    getQuestionSetQuestions,

};
