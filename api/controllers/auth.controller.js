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

export const google = async (req, res, next) => {
  try {
    console.log("Incoming Google data:", req.body); // debug log

    const { email, name, profilePic } = req.body;

    // Säkerställ att e-post finns
    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    // Kolla om användaren finns redan
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = existingUser._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }

    // Fall-back för namn om det saknas
    const usernameFromName = name
      ? name.split(" ").join("").toLowerCase()
      : "user" + Math.random().toString(36).slice(-4);

    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 8);

    const newUser = new User({
      username: usernameFromName + Math.random().toString(36).slice(-4),
      email,
      password: hashedPassword,
      avatar: profilePic || "", // profilbild kan vara tom
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = newUser._doc;

    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);

  } catch (error) {
    console.error("Google auth error:", error); // <-- ny logg
    next(errorHandler(500, error.message || "Unknown error in Google auth"));
  }
};
