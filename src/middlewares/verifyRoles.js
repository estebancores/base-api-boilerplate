const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
      next();
  }
}

module.exports = verifyRoles