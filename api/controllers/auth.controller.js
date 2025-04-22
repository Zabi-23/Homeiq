//api/controllers/auth.controller.js

import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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


// create login function

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid password"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
  
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);

  } catch (error) {
    next(error);
  }
};
