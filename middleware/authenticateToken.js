// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");
const constant = require("../constants");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(constant.UNAUTHORIZED);
    throw new Error("Access Denied");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.status(constant.FORBIDDEN);
      throw new Error("Invalid Token");
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
