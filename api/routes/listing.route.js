//api/routes/listing.route.js
import express  from 'express';
import { createListing , deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { deleteListingImages } from '../controllers/listing.controller.js';
/* import { verifyToken } from '../utils/verifyUser.js'; */
const router = express.Router();

/* router.post('/create', verifyToken ,createListing); */
router.post('/create', createListing);
router.delete('/delete/:id', deleteListing);
router.put('/update/:id', updateListing); // Assuming you want to use the same createListing function for updates
router.get('/get/:id', getListing);
router.get('/get', getListings);
router.put('/delete-images/:id', deleteListingImages);
 



export default router;