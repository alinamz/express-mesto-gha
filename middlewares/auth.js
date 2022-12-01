const jwt = require('jsonwebtoken');
const config = require('config');

const LoginFailed = require('../errors/LoginFailed');

module.exports = (req, res, next) => {
  let token = req.cookies.jwt;
  console.log('COOKIES TOKEN', token);
  if (!token) {
    token = req.headers.Authorization.replace(/^Bearer*\s*/i, '');
    console.log('HEADER TOKEN', token);
    if (!token) {
      next(new LoginFailed('Ошибка входа'));
    }
  }

  let decoded;

  try {
    const SALT = config.get('SALT');
    decoded = jwt.verify(token, SALT);
    req.user = decoded;
    next();
  } catch (err) {
    next(new LoginFailed('Ошибка входа'));
  }
};
