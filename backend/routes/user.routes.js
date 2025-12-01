const express = require("express");
const userModel = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

/**
 * @route   POST /api/user/register
 * @desc    Register new user
 */
router.post(
  "/register",
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password too short"),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username too short"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }

      const { username, email, password } = req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already taken" });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        username,
        email,
        password: hashPassword,
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * @route   POST /api/user/login
 * @desc    Login user
 */
router.post(
  "/login",
  body("email").trim().isEmail().withMessage("Invalid email"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password too short"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }

      const { email, password } = req.body;

      const user = await userModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

/**
 * @route   POST /api/user/logout
 */
router.post("/logout", (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
