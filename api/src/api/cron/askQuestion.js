const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const { MessagingResponse } = require("twilio").twiml;

module.exports = function () {
    const twiml = new MessagingResponse();
    console.log('Hello world');
    // fetch a random question from the database with askedAt = null
    prisma.Question.findMany({
        where: {
            askedAt: null,
        },
        take: 1,
    }).then((question) => {
        // if there are no questions with askedAt = null, return
        if (question.length === 0) {
            return;
        }
        // get all users
        prisma.User.findMany().then((users) => {
            // for each user, send a text message with the question
            users.forEach((user) => {
                // if user has no phone number, skip this one iteration and move to the next user
                if (!user.phoneNumber) {
                    return;
                }
                const adminPhoneNumber = "+17783482447"
                const messageBody = "🍓" + question[0].text;
                client.messages
                    .create({
                        body: question[0].text,
                        from: twilioPhoneNumber,
                        to: `+1${user.phone}`,
                    })
                    .then((message) => {
                        console.log(message.sid);
                        // add the message to the SentMessages table
                        prisma.SentMessage.create({
                            data: {
                                messageSid: message.sid,
                                phone: user.phone,
                                message: question[0].text,
                            },
                        })
                    })
                    .then((sentMessage) => {
                        console.log(sentMessage);
                    });

            });
            // update the question askedAt to the current date
            prisma.Question.update({
                where: {
                    id: question[0].id,
                },
                data: {
                    askedAt: new Date(),
                },
            }).then((question) => {
                console.log(question);
            });
        });
    });
};