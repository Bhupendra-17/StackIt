const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error("[API ERROR]", message, err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
