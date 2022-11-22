const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ErrorCode = require('../errors/ErrorCode');
const ServerError = require('../errors/ServerError');
const OwnershipError = require('../errors/OwnershipError');

const getCards = ((req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new ServerError('Неизвестная ошибка сервера')));
});

const createCard = ((req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorCode('Некорректные данные при создании карточки'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const deleteCard = ((req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным '_id=${req.params.cardId}' не найдена`);
      } else if (card.owner.toString() !== req.user._id) {
        next(new OwnershipError('Нет доступа'));
      } else {
        card.remove().then(() => res.send({ data: card }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректные данные карточки'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
});

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным '_id=${req.params.cardId}' не найдена`);
      } else { res.send({ data: card }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректные данные карточки.'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным '_id=${req.params.cardId}' не найдена`);
      } else { res.send({ data: card }); }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Некорректные данные карточки.'));
      } else {
        next(new ServerError('Неизвестная ошибка сервера'));
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
