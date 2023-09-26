const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const tokenValidation = require('../middlewares/auth');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const {
  createUser, login,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);
router.use('/users', tokenValidation, usersRouter);
router.use('/cards', tokenValidation, cardsRouter);

router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
