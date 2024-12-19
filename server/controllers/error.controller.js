import AppError from "../utils/AppError.js";

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleDuplicateFieldsDB = (err) => {
  const regex = /index: (\w+)_\d+ dup key: { (\w+): "([^"]+)" }/;
  const match = err.errorResponse.errmsg.match(regex);
  const message = `Duplicate field ${match[2]}: ${match[3]}. Please use another value`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError("Invalid Token. Please login again.", 400);

const handleTokenExpiredError = () =>
  new AppError("Your token has expired. Please login again.", 400);

const globalErrorHandler = (err, req, res, next) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError") error = handleTokenExpiredError(error);
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
