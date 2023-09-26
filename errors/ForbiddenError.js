const { FORBIDDEN_CODE } = require('../utils/utils');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_CODE;
  }
}

module.exports = ForbiddenError;
