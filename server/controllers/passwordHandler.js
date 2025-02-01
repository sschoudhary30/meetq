const express = require("express");
const router = express.Router();
require("dotenv").config();
const {collection, query, where, getDocs } = require("firebase/firestore");
const {firestore} = require("../utils/firebaseUtil")
const {bcrypt_password_generate} = require("../utils/hashUtil")

// Load the Firebase service account key
const serviceAccount = require("../utils/social-media-a5960-firebase-adminsdk-u04st-e8a2582344.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// password handle encryption
router.post("/", async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ success: false, message: "Enter password" });
    }
    try {
        //encrypt password
        const encrypted_password = await bcrypt_password_generate(password);
        return res.json({ success: true, message: "Encryption successful", password: encrypted_password });
    } catch (error) {
        console.error("Error in encryption:", error.message);
        return res.status(500).json({ success: false, message: "Failed to encrypt password", error: error.message });
    }
});

// password check during login
router.post("/login", async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Enter valid username and password" });
    }
    // check if username exists
    const usersRefUser = collection(firestore, "users");
    const q1 = query(usersRefUser, where("username", "==", account));
    const querySnapshotq1 = await getDocs(q1);
    if (querySnapshotq1.empty) {
        return res.status(400).json({ success: false, message: "No such username exists, enter a valid account" });
    }
    res.json({ success: true, message: "OTP verified successfully." });
});

module.exports = router;
