const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_CODE } = require('../utils/utils');

const { SECRET_KEY } = process.env;

const tokenValidation = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_CODE).send({ message: 'Войти не удалось' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return res.status(UNAUTHORIZED_CODE).send({ message: 'Войти не удалось' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

module.exports = tokenValidation;
