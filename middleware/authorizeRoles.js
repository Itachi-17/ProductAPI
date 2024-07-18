// middleware/authorizeRoles.js
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: "Access Denied" });
    }
  };
};

module.exports = authorizeRoles;
