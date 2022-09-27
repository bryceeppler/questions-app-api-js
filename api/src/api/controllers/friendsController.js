const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();

const getPendingFriends = (req, res) => {
  const { id } = req.params;
  prisma.Friend
  // get the username for the User with user2Id
    .findMany({
      where: {
        OR: [
          {
            user1Id: Number(id),
          },
          {
            user2Id: Number(id),
          },
        ],
        status : "PENDING"
      },
      include: {
        user1: true,
        user2: true,
      },
    })
    .then((friends) => {
      res.json(friends);
    });
};

const createFriend = (req, res) => {
  prisma.Friend
    .create({
      data: {
        ...req.body,
      },
    })
    .then((friend) => {
      res.json(friend);
    });
};

module.exports = {
    getPendingFriends,
    createFriend

};
