const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Import the delete handler
const deleteHandler = require("./controllers/deleteHandler");
// Use the delete handler for `/delete-image` route
app.use("/delete-image", deleteHandler);

// Import the sendOTP handler for email
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

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the main server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
