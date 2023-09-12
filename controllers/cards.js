const mongoose = require('mongoose');
const {
  INVALID_ERROR_CODE, NOT_FOUND_CODE, ERROR_CODE, OK_CODE, CREATED_CODE,
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
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(OK_CODE).send(cards);
    })
    .catch((err) => {
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(OK_CODE).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные карточки' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
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
      return res.status(OK_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
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
      return res.status(OK_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
