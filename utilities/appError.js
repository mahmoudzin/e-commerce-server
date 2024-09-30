module.exports = class AppError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    if (this.statusCode === 422 && errors) {
      this.errors = errors;
    }
  }
};
