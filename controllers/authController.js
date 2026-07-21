const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// @desc    Login admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  email = email?.trim().toLowerCase();
  password = password?.trim();

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // password field select:false hai, is liye explicitly include karna hai
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !admin.isActive) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    },
  });
});

// @desc    Get logged-in admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.admin,
  });
});

module.exports = {
  loginAdmin,
  getAdminProfile,
};