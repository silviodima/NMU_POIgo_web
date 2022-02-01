const express = require("express");
const router = express.Router();

// Load Category model
const Category = require("../../models/Category");

// @route GET api/categories/get
// @desc get categories
// @access Public
router.get("/", async (req, res) => {
    // console.log("categories.js")
    const categories = await Category.find();
    res.send(categories)
    // const categories =  Category.find();
    // // console.log(categories)
    // // res.send(categories)
    // res.json(categories);
});

module.exports = router;
