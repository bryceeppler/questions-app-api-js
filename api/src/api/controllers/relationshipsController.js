const Prisma = require("prisma/prisma-client");
const router = require("../routes/questions");
const prisma = new Prisma.PrismaClient();
const jwt = require('jsonwebtoken');
// const getRelationshipData = (req, res) => {
//   const { id } = req.params;
//   prisma.Relationship.findUnique({
//     where: {
//       id: parseInt(id),
//     },
//     include: {
//       user1: {
//         select: {
//           username: true,
//         },
//       },
//       user2: {
//         select: {
//           username: true,
//         },
//       },
//       questionSet: true,
//       answers: {
//         where: {
//           relationshipId: parseInt(id),
//         },
//       },
//     },
//   }).then((relationship) => {
//     res.json(relationship);
//   });
// };

// we want getRelationshipData to return
// {
//   id
//   createdAt
//   currentUser
//   otherUser
//   questionSet {
//     id
//     createdAt
//     questions {
//       ...question fields
// .     answers for this question between these two users
//     }
//   }

const getRelationshipData = (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;

  prisma.Relationship.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      user1: true,
      user2: true,
      questionSet: {
        include: {
          questions: {
            include: {
              answers: {
                where: {
                  relationshipId: parseInt(id),
                },
              },
            },
          },
        },
      },
    },
  }).then((relationship) => {
    const currentUser = relationship.user1.id === userId ? relationship.user1 : relationship.user2;
    const otherUser = relationship.user1.id === userId ? relationship.user2 : relationship.user1;
    const relationshipData = {
      id: relationship.id,
      createdAt: relationship.createdAt,
      currentUser: currentUser,
      otherUser: otherUser,
      questionSet: relationship.questionSet,
    };
    res.json(relationshipData);
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

// a more complex version that only gets relationships where users are accepted friends
// const getUserRelationships = (req, res) => {
//   const { id } = req.params;
//   // get all relationships for this user
//   prisma.User.findUnique({
//     where: {
//       id: parseInt(id),
//     },
//     include: {
//       relationships1: true,
//       relationships2: true,
//       friends1: true,
//       friends2: true,
//     },
//   }).then((user) => {
//     // return all relationships
//     let combinedRelationships = user.relationships1.concat(user.relationships2);
//     // for each relationship in combinedRelationships, we need to add the username for user1Id and user2Id
//     let promises = [];
//     combinedRelationships.forEach((relationship) => {
//       promises.push(
//         prisma.User.findUnique({
//           where: {
//             id: relationship.user1Id,
//           },
//         })
//       );
//       promises.push(
//         prisma.User.findUnique({
//           where: {
//             id: relationship.user2Id,
//           },
//         })
//       );
//     });
//     Promise.all(promises).then((users) => {
//       // users is an array of all the users in the relationships
//       // we need to add the username to each relationship
//       combinedRelationships.forEach((relationship) => {
//         users.forEach((user) => {
//           if (relationship.user1Id === user.id) {
//             relationship.user1Username = user.username;
//           }
//           if (relationship.user2Id === user.id) {
//             relationship.user2Username = user.username;
//           }
//         });
//       });
//       // we need to filter out Relationships with users who we do not have a Friend relationship with
//       // the status of the Friend relationship must be 'accepted'
//       let friends = user.friends1.concat(user.friends2);
//       let filteredRelationships = combinedRelationships.filter((relationship) => {
//         let found = false;
//         friends.forEach((friend) => {
//           if (
//             (friend.user1Id === relationship.user1Id ||
//               friend.user1Id === relationship.user2Id) &&
//             (friend.user2Id === relationship.user1Id ||
//               friend.user2Id === relationship.user2Id) &&
//             friend.status === "ACCEPTED"
//           ) {
//             found = true;
//           }
//         });
//         return found;
//       });
//       res.json(filteredRelationships);
//       // res.json(combinedRelationships);
//     });

//   });
// };
// a simple version that gets all relationships for a user
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
    },
    // return all relationships but change combinedRelatinoships.userId to be the other user's id
  }).then((user) => {
    let combinedRelationships = user.relationships1.concat(user.relationships2);
    combinedRelationships.forEach((relationship) => {
      if (relationship.user1Id === parseInt(id)) {
        relationship.userId = relationship.user2Id;
      } else {
        relationship.userId = relationship.user1Id;
      }
    });
    // remove user1Id and user2Id from the relationships
    combinedRelationships.forEach((relationship) => {
      delete relationship.user1Id;
      delete relationship.user2Id;
    });
    // replace userId with the user object
    let promises = [];
    combinedRelationships.forEach((relationship) => {
      promises.push(
        prisma.User.findUnique({
          where: {
            id: relationship.userId,
          },
        })
      );
    });
    Promise.all(promises).then((users) => {
      combinedRelationships.forEach((relationship) => {
        users.forEach((user) => {
          if (relationship.userId === user.id) {
            // relationship.user = user except we want to exclude the password field

            relationship.user = {
              id: user.id,
              username: user.username,
              email: user.email,
              createdAt: user.createdAt,
              phone: user.phone
            };
          }
        });
      });

      // remove userId from the relationships
      combinedRelationships.forEach((relationship) => {
        delete relationship.userId;
      });
    res.json(combinedRelationships);
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
