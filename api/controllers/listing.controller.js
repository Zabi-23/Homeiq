//api/controllers/listing.controller.js

import Listing from "../models/listing.model.js";
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {

    try {
        // Kontrollera om det redan finns en listing med samma address
        const existingListing = await Listing.findOne({address: req.body.address});
        if (existingListing) {
            return res.status(400).json({
                success: false,
                 message: "A listing with this address already exists.",
                 });
        }
        // Skapa en ny listing
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)

    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));  
        }

       /*  if (listing.userId !== listing.userRef) {
            return next(errorHandler(401, "You can only delete your own listings"));
        }
 */
        try {
            await Listing.findByIdAndDelete(req.params.id);
            return res.status(200).json("Listing has been deleted!");
        }
        catch (error) {
            next(error);
        }
        
}