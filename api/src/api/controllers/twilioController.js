const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const { MessagingResponse } = require("twilio").twiml;

const sms = (req, res) => {
  // get the message from the twilio request
  const twiml = new MessagingResponse();
  var msgFrom = req.body.From;
  // strip the +1 from the phone number
  msgFrom = msgFrom.substring(2);

  var msgBody = req.body.Body;

  // get the question with the most recent askedAt date
  prisma.Question.findMany({
    // find the most recent, exlcuding null dates
    orderBy: {
      askedAt: { sort: "desc", nulls: "last" },
    },
    take: 1,
  }).then((question) => {
    // find the user with the phone number
    prisma.User.findUnique({
      where: {
        phone: msgFrom,
      },
      include: {
        answers: true,
      },
    }).then((user) => {
      const answerExists = user.answers.some((answer) => {
        return answer.questionId === question[0].id;
      });
      if (answerExists) {
        twiml.message(
          "You have already answered this question today what're u doin?"
        );
        res.send(twiml.toString());
        return;
      }

      // get the relationship where this user.id is user1Id OR user2Id
      prisma.Relationship.findMany({
        take: 1,
        where: {
          OR: [
            {
              user1Id: user.id,
            },
            {
              user2Id: user.id,
            },
          ],
        },
      }).then((relationship) => {
        prisma.Answer.create({
          data: {
            questionId: question[0].id,
            relationshipId: relationship[0].id,
            userId: user.id,
            text: msgBody,
          },
        }).then((answer) => {
          // send a message back to the user
          // template string for the message including the username
          const message = `Thanks for your answer, ${user.username}!`;
          twiml.message(message);
          res.send(twiml.toString());
        });
      });
    });
  });
};

const dispatchQuestion = (req, res) => {
    // get the question with the most recent askedAt date
    prisma.Question.findMany({
      // find the most recent, exlcuding null dates
      orderBy: {
        askedAt: { sort: "desc", nulls: "last" },
      },
      take: 1,
    }).then((question) => {
      // get all users
      prisma.User.findMany().then((users) => {
        const bodyText = "🍓 " + question[0].text;
        // for each user, send a message
        users.forEach((user) => {
          // send a message to the user
          client.messages
            .create({
              body: bodyText,
              from: twilioPhoneNumber,
              to: `+1${user.phone}`,
            })
            .then((message) => {
              console.log(message.sid);
            });
        });
      });
    });

  res.json({
    message: "Message sent",
  });
};

const sendMessage = (req, res) => {
  // send a twilio message
  client.messages
    .create({
      body: "Hello from Node",
      from: twilioPhoneNumber,
      to: "+16175551212",
    })
    .then((message) => console.log(message.sid));
}

module.exports = {
  sendMessage,
  dispatchQuestion,
  sms,
};
