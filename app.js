const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const SERVER_ERROR = 500;

const { userLoginValidator, userBodyValidator } = require('./utils/celebrate');

const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', (err) => {
  if (err) throw err;
  console.log('Connected to mongodb');
});

app.use(cookieParser());
app.use(bodyParser.json());

app.post('/signin', userLoginValidator, login);
app.post('/signup', userBodyValidator, createUser);
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

// Обработка несуществующего метода.
app.all('/*', (req, res, next) => {
  next(new NotFoundError('Указанный метод не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || SERVER_ERROR;
  const message = statusCode === SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;
  res.status(err.statusCode).send({ message });
  next();
});

app.listen(3000);
