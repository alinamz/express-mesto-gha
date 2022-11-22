const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

const { userLoginValidator, userBodyValidator } = require('./utils/celebrate');

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', (err) => {
  if (err) throw err;
  console.log('Connected to mongodb');
});

app.use(bodyParser.json());

app.post('/signin', userLoginValidator, login);
app.post('/signup', userBodyValidator, createUser);

// app.use('/', auth, cardRouter);
app.use('/', auth, userRouter, cardRouter);

// Обработка несуществующего метода.
app.use((req, res) => {
  res.status(404).json({ message: 'Указанный метод не найден' });
});

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(3000);
