const mongoose = require('mongoose');
const User = require('../models/user');

const createUser = (req, res) => {
  // получим из объекта запроса имя,описание и ссылку на аватар пользователя
  const { name, about, avatar } = req.body;

  // создадим документ в БД на основе пришедших данных
  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((evt) => {
      console.log(evt);
      if (evt instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: evt.message });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((evt) => {
      console.log(evt);
      res.status(500).send({ message: evt.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((evt) => {
      console.log(evt);
      if (evt instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(500).send({ message: evt.message });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
