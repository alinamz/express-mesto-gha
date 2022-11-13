const User = require('../models/user');

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getUsers = ((_, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные' });
      } else {
        res.send({ data: users });
      }
    })
    .catch(() => res.status(SERVER_ERROR).send({ message: 'Неизвестная ошибка сервера' }));
});

const getUserId = ((req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (user == null) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные при получении пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Неизвестная ошибка сервера' });
      }
    });
});

const createUser = ((req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Неизвестная ошибка сервера' });
      }
    });
});

const updateUser = ((req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
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
    });
});

const updateAvatar = ((req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        console.log(user);
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
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
    });
});

module.exports = {
  getUsers, getUserId, createUser, updateUser, updateAvatar,
};
