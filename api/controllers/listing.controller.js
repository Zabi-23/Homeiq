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

// Delete one or more images from a listing
export const deleteListingImages = async (req, res, next) => {
    const { id } = req.params;
    const {imageUrls } = req.body;

    try {
        const listing = await Listing.findById(id);
        if(!listing) {
            return next(errorHandler(404, "Listing not found"));

        }
        listing.imageUrls = listing.imageUrls.filter(url => !imageUrls.includes(url));

        await listing.save();
        return res.status(200).json({
            success: true,
            message: "Images deleted successfully",
            listing
        });
    } catch (error){
        next(error);
    }

}

// Update a listing

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        return next(errorHandler(404, "Listing not found"));  
    }

    /* if (listing.userId !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own listings"));
    } */

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

// Get a listing by ID
export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing not found"));  
        }
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

// Create getListings for searchBox 
export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
        const startIndex = parseInt(req.query.startIndex) || 0; // Default startIndex to 0 if not provided
        let offer = req.query.offer;

        if( offer === undefined || offer === "false" ) {
            offer = {$in: [false, true]} // If offer is undefined or false, return all listings;
        }

        let furnished = req.query.furnished;
        if( furnished === undefined || furnished === "false" ) {
            furnished = {$in: [false, true]} // If furnished is undefined or false, return all listings;
        }

        let parking = req.query.parking;
        if( parking === undefined || parking === "false" ) {
            parking = {$in: [false, true]} // If parking is undefined or false, return all listings;
        }

        let type = req.query.type;
        if( type === undefined || type === "all" ) {
            type = {$in: ['sale', 'rent']} // If type is undefined or false, return all listings;
        }

        const searchTerm = req.query.searchTerm || ""; // Default searchTerm to empty string if not provided

        const sort = req.query.sort || "createdAt"; // Default sort to createdAt if not provided
        const order = req.query.order || "desc"; // Default sortOrder to desc if not provided

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            offer,
            furnished,
            parking,
            type,
 
        }).sort({ [sort]: order })
        .limit(limit).skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
}