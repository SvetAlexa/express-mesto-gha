const router = require('express').Router();
const {
  getUsers, getUserById, getAuthorizedUser, updateUserById, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getAuthorizedUser);
router.patch('/me', updateUserById);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
