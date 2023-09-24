const router = require('express').Router();
const { NOT_FOUND_CODE } = require('../utils/utils');
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

router.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Страница не найдена' });
});

module.exports = router;
