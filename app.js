const bodyParser = require('body-parser');
const express = require("express")
const app = express()
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', err => {
  if (err) throw err;
  console.log('Connected to mongodb');
});

app.use((req, _, next) => {
  req.user = {
    _id: '636ce7e32e8d3ef20a0588bf'
  };
  next();
});

app.use(bodyParser.json());

app.use(require('./routes/user'));
app.use(require('./routes/card'));

// Обработка несуществующего метода.
app.use(function(req, res) {
  res.status(404).json({ message: 'Указанный метод не найден' });
  return;
});

app.listen(3000);
