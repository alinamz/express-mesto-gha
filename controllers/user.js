const User = require("../models/user")

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getUsers = ((_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" }));
});

const getUserId = ((req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
     if(user == null) {
      res.status(ERROR_CODE).send({ message: "Некорректные данные при получении пользователя" });
     } else {
      res.send(user);
     }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" }));
});

const createUser = ((req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: "Некорректные данные при создании пользователя" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" });
      }
    })
});

const updateUser = ((req, res) => {
  const { _id, name, about } = req.body;
  User.findByIdAndUpdate(_id, { name, about })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Пользователь с указанным _id не найден." })
      } else {
        res.send({ data: user })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Неизвестная ошибка сервера' });
      }
    })
});

const updateAvatar = ((req, res) => {
  const { _id, avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "Пользователь с указанным _id не найден."});
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Неизвестная ошибка сервера' });
      }
    })
})

module.exports = {
  getUsers, getUserId, createUser, updateUser, updateAvatar
}