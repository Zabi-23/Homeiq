//api/routes/user.rout.js
import express from 'express';
import { updateUser, test } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:id', verifyToken, updateUser);
/* router.delete('/delete/:id', verifyToken, deleteUser); */

//delete user just by id without token
router.delete('/delete/:id', deleteUser);

export default router;
