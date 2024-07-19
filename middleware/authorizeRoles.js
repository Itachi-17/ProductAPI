// middleware/authorizeRoles.js
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Access Denied");
    }
    next();
  };
};

module.exports = authorizeRoles;
