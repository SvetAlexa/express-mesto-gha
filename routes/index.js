const router = require('express').Router();
const { NOT_FOUND_CODE } = require('../utils/utils');

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Страница не найдена' });
});

module.exports = router;
