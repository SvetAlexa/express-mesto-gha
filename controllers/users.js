const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CREATED_CODE, MONGO_DUPLICATE_ERROR_CODE } = require('../utils/errorStatusCode');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/user');

const { SECRET_KEY, SALT_ROUNDS } = require('../config');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  // создадим документ в БД на основе пришедших данных
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash, // записываем хеш в базу
      },
    ))
    // вернём записанные в базу данные
    .then((user) => {
      const { _id } = user;
      res.status(CREATED_CODE).send({
        data: {
          name, about, avatar, _id,
        },
      });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(err);
    });
};

const getAuthorizedUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные пользователя'));
      }
      return next(err);
    });
};

function updateUserInfo(req, res, next, id, object) {
  User.findByIdAndUpdate(
    id,
    object,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      return res.send({ data: user });
    })
    .catch(next);
}

const updateUserById = (req, res, next) => {
  const { name, about } = req.body;
  updateUserInfo(req, res, next, req.user._id, { name, about });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  updateUserInfo(req, res, next, req.user._id, { avatar });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getAuthorizedUser,
  updateUserById,
  updateAvatar,
  login,
};
