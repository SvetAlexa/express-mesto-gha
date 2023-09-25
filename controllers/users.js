const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  INVALID_ERROR_CODE, UNAUTHORIZED_CODE, NOT_FOUND_CODE, CONFLICT_ERROR, ERROR_CODE, CREATED_CODE,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../utils/utils');
const User = require('../models/user');

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  // создадим документ в БД на основе пришедших данных
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    // вернём записанные в базу данные
    .then((user) => {
      res.status(CREATED_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log(err);
        return res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(CONFLICT_ERROR).send({ message: 'Такой пользователь уже существует' });
      }
      console.log(err);
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
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
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении пользователя' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
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
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(process.env.SECRET_KEY);
      const token = jwt.sign({ _id: user._id }, 'secretKey', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ token });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      console.log(err);
      res.status(UNAUTHORIZED_CODE).send({ message: 'Войти не удалось' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  updateAvatar,
  login,
};
