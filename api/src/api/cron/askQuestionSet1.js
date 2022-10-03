const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const { MessagingResponse } = require("twilio").twiml;

module.exports = function async () {
  // remove req res
  /*
   *   This function is called daily to send a question from questionSet 1
   *   to all users who have a relationship associated questionSet 1.
   */
  const twiml = new MessagingResponse();

  // Fetch a question with askedAt = null and questionSetId = 1
  prisma.Question.findMany({
    where: {
      askedAt: null,
      questionSetId: 1,
    },
    take: 1,
  }).then((question) => {
    // If there are no questions selected, return
    if (question.length === 0) {
      console.log("No available questions");
      return;
    }

    // Get all users who are part of a relationships1 or relationships2 with questionSetId = 1
    prisma.User.findMany({
      where: {
        OR: [
          {
            relationships1: {
              some: {
                questionSetId: 1,
              },
            },
          },
          {
            relationships2: {
              some: {
                questionSetId: 1,
              },
            },
          },
        ],
      },
    })
      .then((users) => {
        // For each user, send a text message with the question, and add this to the SentMessages table
        users.forEach((user) => {
          const message = "Hey " + user.username + "! Here is your question: " + question[0].text;
          // Send message
          client.messages
            .create({
              body: message,
              from: twilioPhoneNumber,
              to: `+1${user.phone}`,
            })
            .then((message) => { 
                // add the message to the SentMessages table
                prisma.SentMessage.create({
                    data: {
                    messageSid: message.sid,
                    phone: user.phone,
                    message: question[0].text,
                    },
                }).then((sentMessage) => {
                    console.log(sentMessage);
                })
            })
        });
      })
      .then(() => {
          // update the question askedAt to the current date
          prisma.Question.update({
            where: {
                id: question[0].id,
            },
            data: {
                askedAt: new Date(),
            },
        }).then((question) => {
            console.log("Question updated");
        });
      });
  });
};