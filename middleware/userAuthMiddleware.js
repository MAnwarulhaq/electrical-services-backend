const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const userProtect = asyncHandler(async (req, res, next) => {
  console.log("===== USER PROTECT =====");
  console.log("Authorization:", req.headers.authorization);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      // console.log("User from DB:", user);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
          decoded,
        });
      }

      req.user = user;

      console.log("req.user:", req.user);

      return next();
    } catch (error) {
      console.log("JWT Error:", error);

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "Token missing",
  });
});

module.exports = {
  userProtect,
};