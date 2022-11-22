const jwt = require('jsonwebtoken');
const config = require('config');

const LOGIN_FAILED = 401;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Ошибка авторизации' });
  } else {
    const token = authorization.replace(/^Bearer*\s*/i, '');
    let decoded;

    try {
      const SALT = config.get('SALT');
      decoded = jwt.verify(token, SALT);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(LOGIN_FAILED).send({ message: 'Ошибка входа' });
    }
  }
};
