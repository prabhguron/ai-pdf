class AppError extends Error {
    constructor(message, statusCode, stat=null) {
      const status = (stat) ? stat : `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      super(message); // super() to access the message from Error (inheritance)
      this.statusCode = statusCode;
      this.status = status;
      this.isOperational = true; // to determine operational errors
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;