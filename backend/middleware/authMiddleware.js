
const User = require("../models/User");

async function requireAuth(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        message: "Please log in first",
      });
    }

    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please log in again",
      });
    }

    req.user = user;
    next();
  } catch (error) {
      next(error);
  }
}

module.exports = requireAuth;