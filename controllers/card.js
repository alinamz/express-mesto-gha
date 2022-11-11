const Card = require("../models/card")

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = ((req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" }))
})

const createCard = ((req, res) => {
  const { _id, name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: "Некорректные данные при создании карточки" });
      } else {
        res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" })
      }
    })
})

const deleteCard = ((req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.equals(req.query._id)) {
        card.remove().then(() => res.send({ data: card }));
      } else if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: "Некорректные данные карточки." });
      } else {
        res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" });
      }
    })
})

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.query._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      res.send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: "Некорректные данные карточки." });
      } else {
        res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" });
      }
    });
}

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.query._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' })
      } else {
      res.send({ data: card })
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: "Некорректные данные карточки." });
      } else {
        res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" });
      }
    })


module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
}