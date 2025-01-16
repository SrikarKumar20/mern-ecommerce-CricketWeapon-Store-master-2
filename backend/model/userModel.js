const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"], // Email validation
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should have more than 4 characters"],
    select: false, // this ensures the password is not returned in queries
  },
  avatar: {
    public_id: {
      type: String,
      required: false,  // Optional, depends on your use case (e.g., Cloudinary storage)
    },
    url: {
      type: String,
      required: false,  // Optional
    },
  },
  role: {
    type: String,
    default: "user", // Default role
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set on user creation
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  // If password is not modified, skip the hashing
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password before saving
  this.password = await bcrypt.hash(this.password, 10); // 10 is the salt rounds for bcrypt
  next();
});

// Generate JWT Token for user authentication
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // Token expiry (e.g., 5d)
  });
};

// Compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate password reset token (for resetting user password)
userSchema.methods.getResetPasswordToken = function () {
  // Generate a random token for password reset
  const resetPassToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and save it to the user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPassToken)
    .toString("hex");

  // Set the expiration time for the token (15 minutes in this case)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  return resetPassToken;
};

// Create the User model
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;

