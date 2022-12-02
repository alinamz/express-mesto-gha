const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ErrorCode = require('../errors/ErrorCode');
const ConflictError = require('../errors/ConflictError');
const ServerError = require('../errors/ServerError');
const LoginFailed = require('../errors/LoginFailed');

const getUsers = ((_, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
});

const getUserId = ((req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else { next(new NotFoundError('Пользователь с указанным _id не найден')); }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrorCode('Некорректные данные при получении пользователя'));
      } else {
        console.log(err);
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const getCurrentUser = ((req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректные данные при получении пользователя'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const createUser = ((req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => User.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  }))
    .then((document) => {
      const { password: removed, ...user } = document.toObject();
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorCode('Некорректные данные при получении пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует.'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const login = ((req, res, next) => {
  const { email, password } = req.body;
  const SALT = config.get('SALT');
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SALT, { expiresIn: '7d' });
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new LoginFailed('Ошибка входа'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const updateUser = ((req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrorCode('Некорректные данные при получении пользователя'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const updateAvatar = ((req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrorCode('Некорректные данные при получении пользователя'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

module.exports = {
  getUsers, getUserId, createUser, updateUser, updateAvatar, login, getCurrentUser,
};
