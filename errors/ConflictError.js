const { CONFLICT_CODE } = require('../utils/errorStatusCode');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_CODE;
  }
}

module.exports = ConflictError;
