const express = require("express");
const router = express.Router();



// Load POI model
const POI = require("../../models/POI");
  
// Retrieve all the pois
// router.get('/get', async (req, res) => {
//     console.log("Sto qua")
//     const poi = await POI.find();
//     res.send(poi);
// });


// @route POST api/pois/add
// @desc Add poi
// @access Public
router.post("/add", (req, res) => {
    //**************************###############FAI LA FORM VALIDATION
    // Form validation
    // const { errors, isValid } = validateRegisterInput(req.body);
  
    // Check validation
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
  
    const newPOI = new POI({
        poi_name: req.body.poi_name,
        photo: "",
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
            coordinate : [ req.body.latitude,  req.body.longitude]
        },
        sections: req.body.sections
    });
  
    newPOI
        .save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
});

module.exports = router;
