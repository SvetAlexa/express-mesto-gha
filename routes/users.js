const router = require('express').Router();
const {
  createUser, getUsers, getUserById, updateUserById, updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.patch('/me', updateUserById);
router.get('/:userId', getUserById);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
