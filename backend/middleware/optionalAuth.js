const jwt = require("jsonwebtoken");

const optionalAuth = (req, _res, next) => {
  const authHeader = req.header("Authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_err) {
    req.user = null;
  }

  next();
};

module.exports = optionalAuth;
