const mongoose = require('mongoose');
const { CREATED_CODE } = require('../utils/errorStatusCode');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/card');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED_CODE).send({ data: card });
    })
    .catch(next);
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      const ownerId = (card.owner).toString();
      const userId = req.user._id;
      if (ownerId !== userId) {
        throw next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((deletedCard) => res.send(deletedCard))
    .catch(next);
};

function updateLikeCard(req, res, next, id, object) {
  Card.findByIdAndUpdate(
    id,
    object,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
}

const likeCard = (req, res, next) => {
  updateLikeCard(req, res, next, req.params.cardId, { $addToSet: { likes: req.user._id } });
};

const dislikeCard = (req, res, next) => {
  updateLikeCard(req, res, next, req.params.cardId, { $pull: { likes: req.user._id } });
};

module.exports = {
  createCard,
  getCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
