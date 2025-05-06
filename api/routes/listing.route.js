//api/routes/listing.route.js
import express  from 'express';
import { createListing , deleteListing} from '../controllers/listing.controller.js';
/* import { verifyToken } from '../utils/verifyUser.js'; */
const router = express.Router();

/* router.post('/create', verifyToken ,createListing); */
router.post('/create', createListing);
router.delete('/delete/:id', deleteListing);


export default router;