const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares').requireAuth;

const relationshipsController = require('../controllers/relationshipsController');

router.use(requireAuth);

router.get('/', relationshipsController.getAllRelationships);
router.post('/', relationshipsController.createRelationship);
router.get('/get_by_user/:id', relationshipsController.getUserRelationships);
router.get('/data/:id', relationshipsController.getRelationshipData);
router.delete('/:id', relationshipsController.deleteRelationship);

module.exports = router;