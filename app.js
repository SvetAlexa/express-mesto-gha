const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
})
  .then(() => {
    console.log('connected to DB')
  })
  .catch(() => {
    console.log('no connection')
  })

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})