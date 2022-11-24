const jwt = require('jsonwebtoken');
const config = require('config');

const LoginFailed = require('../errors/LoginFailed');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new LoginFailed('Ошибка входа'));
  } else {
    let decoded;

    try {
      const SALT = config.get('SALT');
      decoded = jwt.verify(token, SALT);
      req.user = decoded;
      next();
    } catch (err) {
      next(new LoginFailed('Ошибка входа'));
    }
  }
};
