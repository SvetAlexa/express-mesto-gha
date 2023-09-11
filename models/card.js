const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: ObjectId,
    required: true
  },
  likes: {
    type: ObjectId,
    required: true
  },
  createdAt: {
    type: Date
  }
});

module.exports = mongoose.model('card', cardSchema);