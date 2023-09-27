const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const tokenValidation = require('../middlewares/auth');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const {
  createUser, login,
} = require('../controllers/users');
const { REGEX_URL } = require('../utils/constants');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX_URL),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use('/users', tokenValidation, usersRouter);
router.use('/cards', tokenValidation, cardsRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
