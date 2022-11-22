const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/card');
const { cardIdValidator, cardBodyValidator } = require('../utils/celebrate');

router.get('/cards', getCards);
router.post('/cards', cardBodyValidator, createCard);
router.delete('/cards/:cardId', cardIdValidator, deleteCard);
router.put('/cards/:cardId/likes', cardIdValidator, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
