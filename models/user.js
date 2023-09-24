const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Введите адрес e-mail в правильном формате',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
