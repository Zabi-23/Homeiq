//api/controllers/listing.controller.js

import Listing from "../models/listing.model.js";
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