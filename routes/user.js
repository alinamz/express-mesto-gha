const router = require('express').Router();

const {
  getUsers, getUserId, createUser, updateAvatar, updateUser,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:id', getUserId);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
