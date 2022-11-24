const router = require('express').Router();

const {
  getUsers, getUserId, updateAvatar, updateUser, getCurrentUser,
} = require('../controllers/user');
const { userAvatarValidator, userDescriptionValidator, userIdValidator } = require('../utils/celebrate');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', userIdValidator, getUserId);
router.patch('/me', userDescriptionValidator, updateUser);
router.patch('/me/avatar', userAvatarValidator, updateAvatar);

module.exports = router;
