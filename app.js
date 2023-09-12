const express = require('express');
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
