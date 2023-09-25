const mongoose = require('mongoose');
const {
  INVALID_ERROR_CODE, FORBIDDEN_CODE, NOT_FOUND_CODE, ERROR_CODE, CREATED_CODE,
} = require('../utils/utils');
const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return Promise.reject(new Error('Карточка с указанным _id не найдена'));
      // return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      const ownerId = (card.owner).toString();
      const userId = req.user._id;
      if (ownerId !== userId) {
        return Promise.reject(new Error('forbidden'));
        // return res.status(FORBIDDEN_CODE).send({ message: 'Ошибка доступа' });
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((deletedCard) => res.send(deletedCard))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные карточки' });
        return;
      }
      if ({ err: 'forbidden' }) {
        res.status(FORBIDDEN_CODE).send({ message: 'Ошибка доступа' });
        return;
      }
      console.log(err);
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
