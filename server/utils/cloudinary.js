const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: "dmshtfcw2",
    api_key: "458293133655783",
    api_secret: "0jF_fcmheEMbbbQbnhGmB-I0II0",
  });

module.exports = cloudinary;