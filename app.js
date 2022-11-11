const bodyParser = require('body-parser');
const express = require("express")
const app = express()
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', err => {
  if (err) throw err;
  console.log('Connected to mongodb');
});

app.use(bodyParser.json());

app.use(require('./routes/user'));
app.use(require('./routes/card'));

app.use((req, res, next) => {
  req.user = {
    _id: '636ce7e32e8d3ef20a0588bf'
  };
  next();
});

app.listen(3000);
