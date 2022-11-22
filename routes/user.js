const router = require('express').Router();

const {
  getUsers, getUserId, updateAvatar, updateUser, getCurrentUser,
} = require('../controllers/user');
const { userAvatarValidator, userDescriptionValidator, userIdValidator } = require('../utils/celebrate');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:id', userIdValidator, getUserId);
router.patch('/users/me', userDescriptionValidator, updateUser);
router.patch('/users/me/avatar', userAvatarValidator, updateAvatar);

module.exports = router;
