const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// const userProtect = asyncHandler(async (req, res, next) => {
//   let token;

  
// console.log("Authorization Header:", req.headers.authorization); // Debugging line
// console.log("Token:", token); // Debugging line
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         res.status(401);
//         throw new Error("User not found");
//       }

//       if (!req.user.isActive) {
//         res.status(403);
//         throw new Error("Your account has been deactivated");
//       }

//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized, invalid token");
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, token missing");
//   }
// });

const userProtect = asyncHandler(async (req, res, next) => {
  console.log("===== USER PROTECT =====");
  console.log("Authorization:", req.headers.authorization);
  console.log("Headers:", req.headers);

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    return next();
  }

  res.status(401);
  throw new Error("Not authorized, token missing");
});
module.exports = {
  userProtect,
};