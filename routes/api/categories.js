const express = require("express");
const router = express.Router();

// Load Category model
const Category = require("../../models/Category");

// @route GET api/categories/get
// @desc get categories
// @access Public
router.get("/", (req, res) => {
    //**************************###############FAI LA FORM VALIDATION
    // Form validation
    // const { errors, isValid } = validateRegisterInput(req.body);
  
    // Check validation
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    const categories = await Category.find();
    res.send(categories);
});

module.exports = router;
