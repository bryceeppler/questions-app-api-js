const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();

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
    createQuestionSet

};
