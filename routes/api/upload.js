const { cloudinary } = require("../../utils/cloudinary");
const express = require("express");
const router = express.Router();

var cors = require('cors');

router.use(express.static('public'));
// router.use(express.json({ limit: '50mb' }));
router.use(express.json({ limit: "50mb" }))

router.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000}));
router.use(cors());

router.post('/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        // console.log(fileStr)
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            //the folder that I have created on cloudinary account
            upload_preset: 'upload_POIGO',
            
        },
        );
        // console.log("26"+uploadResponse.secure_url);
        //set the url in the response
        res.json({msg: uploadResponse.secure_url});
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

module.exports = router;
