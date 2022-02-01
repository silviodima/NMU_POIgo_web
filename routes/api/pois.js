const express = require("express");
const router = express.Router();

// Load input validation
const validatePOIInsertion = require("../../validation/addPoi");

// Load POI model
const POI = require("../../models/POI");

// @route POST api/pois/add
// @desc Add poi
// @access Public
router.post("/add", (req, res) => {
    console.log(req.body)
    // Form validation
    const { errors, isValid } = validatePOIInsertion(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPOI = new POI({
        name: req.body.poi_name,
        photo: req.body.photo,
        description: req.body.description,
        opening_hours: req.body.opening_hours,
        activity: {
            email: req.body.email,
            partita_iva: req.body.partita_iva,
            tel_number: req.body.tel_number
        },
        is_Validate: true,
        location : {
            type : 'Point',
            coordinates : [ req.body.latitude,  req.body.longitude],
            address: req.body.address,
        },

        sections: req.body.clickedSections,
        createdBy: req.body.createdBy
    });
  
    newPOI
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
});

module.exports = router;
