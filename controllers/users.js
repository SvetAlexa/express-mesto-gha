const mongoose = require('mongoose');
const {
  INVALID_ERROR_CODE, NOT_FOUND_CODE, ERROR_CODE, OK_CODE, CREATED_CODE,
} = require('../utils/utils');
const User = require('../models/user');

const createUser = (req, res) => {
  // получим из объекта запроса имя,описание и ссылку на аватар пользователя
  const { name, about, avatar } = req.body;

  // создадим документ в БД на основе пришедших данных
  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => {
      res.status(CREATED_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_CODE).send(users);
    })
    .catch((err) => {
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(OK_CODE).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(OK_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(OK_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(ERROR_CODE).send({ message: err.message });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateAvatar,
};
