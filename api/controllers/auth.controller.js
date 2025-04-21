//api/controllers/auth.controller.js

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Validera lösenordslängd
    if (!password || password.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters long"));
    }

    // Kolla om användare redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(409, "User already exists"));
    }

    // Hasha lösenord
    const hashedPassword = await bcrypt.hash(password, 8);

    // Skapa ny användare
    const newUser = new User({
      email,
      password: hashedPassword,
      username: username || "anonymous",
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(" error:", error);
    next(errorHandler(500, "error from the function"));
  }
};

