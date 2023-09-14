const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const appRouter = require('./routes/index');

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

// добавляем в каждый запрос объект user
app.use((req, res, next) => {
  req.user = {
    _id: '6500842f38ebe294b39af652',
  };
  next();
});

app.use(appRouter);
