const express = require("express");
const userModel = require("../models/user.model");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error("Render register error:", error);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 13 }),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }
      const { username, email, password } = req.body;
      const existingUser = await userModel.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        username,
        email,
        password: hashPassword,
      });
      res.redirect("/user/login");
      // res.status(201).json({
      //   message:
      //     "User registered successfully. Go to the login page (/user/login)",
      //   user: {
      //     userId: newUser._id,
      //     email: newUser.email,
      //     username: newUser.username,
      //   },
      // });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).send("Internal server error");
    }
  }
);

router.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error("Render login error:", error);
    res.status(500).send("Internal server error");
  }
});

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }
      const { username, password } = req.body;
      const user = await userModel.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Username or password is incorrect" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ message: "Username or password is incorrect" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET
      );
      res.cookie("token", token);
      res.redirect("/home");
      // res.status(200).json({
      //   message: "Login successful. Go to the home page (/home)",
      //   user: {
      //     userId: user._id,
      //     email: user.email,
      //     username: user.username,
      //   },
      // });
    } catch (err) {
      console.error("Login error:", error);
      res.status(500).send("Internal server error");
    }
  }
);

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
