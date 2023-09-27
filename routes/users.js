const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, getAuthorizedUser, updateUserById, updateAvatar,
} = require('../controllers/users');
const { REGEX_URL } = require('../utils/constants');

router.get('/', getUsers);

router.get('/me', getAuthorizedUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserById);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(REGEX_URL),
  }),
}), updateAvatar);

module.exports = router;
