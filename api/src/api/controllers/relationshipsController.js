const Prisma = require("prisma/prisma-client");
const router = require("../routes/questions");
const prisma = new Prisma.PrismaClient();

const getRelationshipData = (req, res) => {
  const { id } = req.params;
  prisma.Relationship.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user1: {
        select: {
          username: true,
        },
      },
      user2: {
        select: {
          username: true,
        },
      },
      answers: {
        where: {
          relationshipId: parseInt(id),
        },
      },
    },
  }).then((relationship) => {
    res.json(relationship);
  });
};

const getAllRelationships = (req, res) => {
  prisma.Relationship.findMany().then((relationships) => {
    res.json(relationships);
  });
};

const createRelationship = (req, res) => {
  prisma.Relationship
    .create({
      data: {
        ...req.body,
        createdAt: new Date(),
      },
    })
    .then((relationship) => {
      res.json(relationship);
    });
};


const getUserRelationships = (req, res) => {
  const { id } = req.params;
  // get all relationships for this user
  prisma.User.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      relationships1: true,
      relationships2: true,
      friends1: true,
      friends2: true,
    },
  }).then((user) => {
    // return all relationships
    let combinedRelationships = user.relationships1.concat(user.relationships2);
    // for each relationship in combinedRelationships, we need to add the username for user1Id and user2Id
    let promises = [];
    combinedRelationships.forEach((relationship) => {
      promises.push(
        prisma.User.findUnique({
          where: {
            id: relationship.user1Id,
          },
        })
      );
      promises.push(
        prisma.User.findUnique({
          where: {
            id: relationship.user2Id,
          },
        })
      );
    });
    Promise.all(promises).then((users) => {
      // users is an array of all the users in the relationships
      // we need to add the username to each relationship
      combinedRelationships.forEach((relationship) => {
        users.forEach((user) => {
          if (relationship.user1Id === user.id) {
            relationship.user1Username = user.username;
          }
          if (relationship.user2Id === user.id) {
            relationship.user2Username = user.username;
          }
        });
      });
      // we need to filter out Relationships with users who we do not have a Friend relationship with
      // the status of the Friend relationship must be 'accepted'
      let friends = user.friends1.concat(user.friends2);
      let filteredRelationships = combinedRelationships.filter((relationship) => {
        let found = false;
        friends.forEach((friend) => {
          if (
            (friend.user1Id === relationship.user1Id ||
              friend.user1Id === relationship.user2Id) &&
            (friend.user2Id === relationship.user1Id ||
              friend.user2Id === relationship.user2Id) &&
            friend.status === "ACCEPTED"
          ) {
            found = true;
          }
        });
        return found;
      });
      res.json(filteredRelationships);
      // res.json(combinedRelationships);
    });

  });
};

const deleteRelationship = (req, res) => {
  const { id } = req.params;
  prisma.Relationship
    .delete({
      where: {
        id: parseInt(id),
      },
    })
    .then((relationship) => {
      res.json(relationship);
    });
};

module.exports = {
  deleteRelationship,
  getAllRelationships,
  createRelationship,
  getUserRelationships,
  getRelationshipData,
};
