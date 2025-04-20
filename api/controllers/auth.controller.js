//api/controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 6);
    const newUser = new User({
      email,
      password: hashedPassword,
      username: req.body.username || "anonymous", // hantera om username saknas
    });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await newUser.save();
    
    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
    
