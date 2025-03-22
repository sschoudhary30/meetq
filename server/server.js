
require("dotenv").config();
const express = require("express");
const vision = require("@google-cloud/vision");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const client = new vision.ImageAnnotatorClient({
  keyFilename: "meetq-449218-65a83ba48b73.json",
});


app.post("/api/analyzeImage", async (req, res) => {
  const { imageURL } = req.body;

  if (!imageURL) {
    return res.status(400).json({ error: "Missing imageURL" });
  }

  try {
    console.log("Analyzing Image:", imageURL);
    const [result] = await client.safeSearchDetection(imageURL);
    const detections = result.safeSearchAnnotation;

    console.log("Analysis Result:", detections);
    return res.json(detections);
  } catch (error) {
    console.error(" Google Vision API Error:", error);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
});
const deleteHandler = require("./controllers/deleteHandler");
// Use the delete handler for `/delete-image` route
app.use("/delete-image", deleteHandler);

app.post("/api/analyzeText", async (req, res) => {
  const { caption } = req.body;

  if (!caption) {
    return res.status(400).json({ error: "Missing caption text" });
  }

  try {
    
    const inappropriateWords = ["hate", "violence","harassment", "spam", "explicit","r4pe","lock it up"];
    const lowerCaption = caption.toLowerCase();
    
    const isInappropriate = inappropriateWords.some((word) => lowerCaption.includes(word));

    return res.json({ status: isInappropriate ? "warning" : "safe" });
  } catch (error) {
    console.error("Error analyzing text:", error);
    return res.status(500).json({ error: "Failed to analyze text" });
  }
});

const sendOTP = require("./controllers/sendOTPHandler")
app.use("/send-otp", sendOTP);

// Import the phoneVerify handler for phone number
const phoneVerify= require("./controllers/phoneVerifyHandler")
app.use("/send-phone-otp", phoneVerify);

// Import the accountVerify handler for account verification
const accountVerify= require("./controllers/accountVerifyHandler")
app.use("/verify-fan", accountVerify);

//encrypt password
//const encryptPassword = require("./controllers/passwordHandler")
//app.use("/password", encryptPassword);

// challenge handling for passkey
const passkeyChallenge = require("./controllers/passKeyChallenge")
app.use("/passkey-challenge", passkeyChallenge)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
