const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');
const errorHandle = require('./middlewares/errorHandle');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('connected to DB'))
  .catch(() => console.log('no connection'));

const app = express();

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Максимальное количество запросов
  message: { message: 'Превышен лимит запросов. Попробуйте еще раз позже.' },
});

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(appRouter);

app.use(errors());

app.use(errorHandle);
