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
    // copy the request body but remove questionId if it exists
    const { questionSetId, ...friendData } = req.body;
    
  prisma.Friend
    .create({
      data: {
        ...friendData,
      },
    })
    .then((friend) => {
        // if there was a questionSetId, create a new relationship between the two
        // users
        if (questionSetId) {
            console.log("creating new relationship");
                console.log("questionSetId", questionSetId);
            console.log("friendData", friendData);
            prisma.Relationship.create({
                data: {
                    user1Id: friendData.user1Id,
                    user2Id: friendData.user2Id,
                    questionSetId: questionSetId,
                }
            }).then((relationship) => {
                res.json(friend);
            })
        } else {
            res.json(friend);

        }
    });
};

const deleteFriendRequest = (req, res) => {
  const { id } = req.params;
  prisma.Friend
    .delete({
      where: {
        id: Number(id),
      },
    })
    .then((friend) => {
      res.json(friend);
    });
};

const acceptFriendRequest = (req, res) => {
  const { id } = req.params;
  prisma.Friend
    .update({
      where: {
        id: Number(id),
      },
      data: {
        status: "ACCEPTED",
      },
    })
    .then((friend) => {
      res.json(friend);
    });
};

const getAcceptedFriends = (req, res) => {
  const { id } = req.params;
  // get a list of users that is friends with the user with id
  prisma.Friend
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
        status : "ACCEPTED"
      },
      // include user1 and user2
      include: {
        user1: true,
        user2: true,
      },
    })
    .then((friends) => {
      // join the two users into one array
      const condensedFriends = friends.map((friend) => {
        if (friend.user1Id === Number(id)) {
          return friend.user2;
        } else {
          return friend.user1;
        }
      });
      res.json(condensedFriends);
    });
};


module.exports = {
  getAcceptedFriends,
    acceptFriendRequest,
    getPendingFriends,
    createFriend,
    deleteFriendRequest,

};
