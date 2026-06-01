const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

// ─────────────────────────────────────────
// SIGNUP ROUTE — POST /api/auth/signup
// ─────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    // 1. Pull name, email, password out of the request body
    const { name, email, password } = req.body;

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 3. Hash the password (10 = how many times to scramble it)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create a new user in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword  // NEVER save plain password
    });

    // 5. Send back a success message
    res.status(201).json({ message: 'Account created successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// LOGIN ROUTE — POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    // 1. Pull email and password from request body
    const { email, password } = req.body;

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Compare the password they typed with the hashed one in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Create a JWT token
    const token = jwt.sign(
      { userId: user._id },         // what to store inside the token
      process.env.JWT_SECRET,        // secret key to sign it with
      { expiresIn: '7d' }            // token expires in 7 days
    );

    // 5. Send token + user info back to frontend
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email, avatar },
      { new: true }
    );

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});
module.exports = router;