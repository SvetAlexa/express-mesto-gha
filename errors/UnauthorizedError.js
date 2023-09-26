const { UNAUTHORIZED_CODE } = require('../utils/utils');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_CODE;
  }
}

module.exports = UnauthorizedError;
