require('dotenv').config();

const { PORT = 3000 } = process.env;
const { SECRET_KEY = 'SECRET_KEY' } = process.env;

module.experts = {
  PORT,
  SECRET_KEY,
};
