const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// TEST ROUTE
// GET /api/auth/test
// ==========================================

router.get("/test", (req, res) => {
  res.json({
    message: "Auth routes are working!",
  });
});


// ==========================================
// REGISTER USER
// POST /api/auth/register
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// LOGIN USER
// POST /api/auth/login
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Please enter email and password",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ==========================================
// GET CURRENT USER PROFILE
// GET /api/auth/profile
// ==========================================

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(user);

    } catch (error) {
      console.error(
        "Profile fetch error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


// ==========================================
// UPDATE CURRENT USER PROFILE
// PUT /api/auth/profile
// ==========================================

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        bio,
        skills,
        interests,
        experience,
      } = req.body;

      // Validate name
      if (!name || !name.trim()) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      const user =
        await User.findByIdAndUpdate(
          req.userId,

          {
            name: name.trim(),
            bio: bio || "",
            skills: skills || [],
            interests: interests || [],
            experience:
              experience || "Beginner",
          },

          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      // User not found
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message:
          "Profile updated successfully",

        user,
      });

    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;