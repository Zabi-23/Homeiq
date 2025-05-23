

// api/controllers/user.controller.js

import bcrypt from "bcryptjs";  
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

// Test route
export const test = (req, res) => {
    res.send('User test route is working!');
}

// ✅ Perfekt säker och optimerad updateUser
export const updateUser = async (req, res, next) => {
  try {
    // 1. Kolla om användaren försöker uppdatera sig själv
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "You can only update your own account!"));
    }

    // 2. Hantera lösenord separat om det skickas
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    // 3. Begränsa vilka fält som får uppdateras (säkerhet!)
    const allowedFields = ['username', 'email', 'password', 'avatar'];
    const fieldsToUpdate = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // 4. Uppdatera användaren i databasen
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // 5. Skicka tillbaka användardata utan lösenord
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: rest,
    });

  } catch (error) {
    next(error);
  }
}


//delete user
/* export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your account!"));
    
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted.");
    } catch (error) {
         next(error)
    }
} */

    // delete user by ID directly (no token check)
export const deleteUser = async (req, res, next) => {
  try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
          return next(errorHandler(404, "User not found!"));
      }
      res.status(200).json("User has been deleted.");
  } catch (error) {
      next(error);
  }
}

/* export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings)
      
    } catch (error) {
      next(error);
    }
  } else{

    return next(errorHandler(401, "You can only view your own listings!"));
  }
  
} */

  export const getUserListing = async (req, res, next) => {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  };
  // Must work on token and user ID check for security

  export const getUser = async (req, res, next) => {
    try {
      
      const user = await User.findById(req.params.id);
    
      if (!user) return next(errorHandler(404, 'User not found!'));
    
      const { password: pass, ...rest } = user._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };