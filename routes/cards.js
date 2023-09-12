const router = require('express').Router();
const { createCard, getCards, deleteCardById } = require('../controllers/cards');

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCardById);

module.exports = router;
