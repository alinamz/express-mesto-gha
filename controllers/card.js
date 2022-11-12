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
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
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
  Card.findById(req.params)
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        card.remove().then(() => res.send({ data: card }));
      } else {
       res.status(ERROR_CODE).send({ message: "Некорректные данные карточки" });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: "Неизвестная ошибка сервера" });
      }
    })
})

const likeCard = (req, res) => {
  console.log("Here");
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
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
    });
}

const dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
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