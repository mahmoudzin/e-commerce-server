const AppError = require("../utilities/appError");

const generateError = (err) => {
  switch (err.name) {
    case "CastError":
      return new AppError(`invalid ${err.path}: ${err.value}`, 400);
    case "ValidationError": //[{main_image: message}]
      return new AppError(
        `validtion error`,
        422,
        Object.keys(err.errors).map((key) => ({
          [key]: err.errors[key].message,
        }))
      );
    case "JsonWebTokenError":
      return new AppError("401 You are not authorized to access this", 401);
    default:
      return err;
  }
};

module.exports = (err, req, res, next) => {
  //   err.statusCode = err.statusCode || 500; //server error
  //   err.status = err.status || "error";

  const error = generateError(err);
  error.statusCode = error.statusCode || 500;
  const response = {
    status: error.status,
    message: error.message,
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  if (process.env.ENV === "dev") {
    response.err = err;
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};
