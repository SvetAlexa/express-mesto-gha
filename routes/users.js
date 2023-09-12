const router = require('express').Router();
const {
  createUser, getUsers, getUserById, updateUserById, updateAvatar,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me', updateUserById);
router.get('/users/:userId', getUserById);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
