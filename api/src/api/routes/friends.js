const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares').requireAuth;

const friendsController = require('../controllers/friendsController');

router.use(requireAuth);

router.get('/pending/:id', friendsController.getPendingFriends);
router.get('/accepted/:id', friendsController.getAcceptedFriends);
router.delete('/:id', friendsController.deleteFriendRequest);
router.put('/:id', friendsController.acceptFriendRequest);
router.post('/', friendsController.createFriend);


module.exports = router;