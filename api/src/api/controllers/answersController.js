const Prisma = require("prisma/prisma-client");
const router = require("../routes/questions");
const prisma = new Prisma.PrismaClient();

const getAllAnswers = (req, res) => {
  prisma.Answer.findMany().then((answers) => {
    res.json(answers);
  });
};

const createAnswers = (req, res) => {
  prisma.Answer
    .create({
      data: {
        ...req.body,
        createdAt: new Date(),
      },
    })
    .then((answer) => {
      res.json(answer);
    });
};

const getAnswer = (req, res) => {
  const { id } = req.params;
  prisma.Answer
    .findUnique({
      where: {
        answer_id: Number(id),
      },
    })
    .then((answer) => {
      res.json(answer);
    });
};

// fetch answers between to users
const matchAnswers = (req, res) => {
  const { asker, askee } = req.params;
  const answers = prisma.Answer
    .findMany({
      where: {
        OR: [
          {
            asker_user_id: Number(asker),
            askee_user_id: Number(askee),
          },
          {
            asker_user_id: Number(askee),
            askee_user_id: Number(asker),
          },
        ]
      },
    })
    .then((answers) => {
      res.json(answers);
    });
};

// get all answers for a relationship
const getAnswersForRelationship = (req, res) => {
  const { id } = req.params;
  prisma.Answer
    .findMany({
      where: {
        relationshipId: Number(id),
      },
    })
    .then((answers) => {
      res.json(answers);
    });
};

// delete answers
const deleteAnswer = (req, res) => {
  const { id } = req.params;
  prisma.Answer
    .delete({
      where: {
        answer_id: Number(id),
      },
    })
    .then((answer) => {
      res.json(answer);
    });
};

module.exports = {
  getAllAnswers,
  createAnswers,
  getAnswer,
  matchAnswers,
  deleteAnswer,
  getAnswersForRelationship,

};
