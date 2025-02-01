const express = require("express");
const router = express.Router();
const cloudinary = require('../utils/cloudinary')

// Route to delete an image
router.post("/:username", async (req, res) => {
  const { publicId } = req.body;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
