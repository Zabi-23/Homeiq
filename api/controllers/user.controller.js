//api/controllers/user.controller.js

/* import bcrypt from "bcryptjs";  
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";


export const test = (req, res) => {
    res.send('User test route is working!');
}   


export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your account!"));
    
    try {
        if (req.body.password) {
           
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true });

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
         next(error)
    }
}
 */

// api/controllers/user.controller.js

import bcrypt from "bcryptjs";  
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

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


