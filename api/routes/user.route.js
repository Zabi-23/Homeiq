//api/routes/user.rout.js
import express from 'express';
import { updateUser, test, getUserListing, deleteUser, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
router.put('/update/:id', verifyToken, updateUser);
/* router.delete('/delete/:id', verifyToken, deleteUser); */

/* router.get('/listing/:id', verifyToken, getUserListing); */ //get user listing by id)
router.get('/listing/:id', getUserListing);
//delete user just by id without token activate token before production
router.delete('/delete/:id', deleteUser);
router.get('/:id', verifyToken, getUser); //get user by id with token

export default router;
