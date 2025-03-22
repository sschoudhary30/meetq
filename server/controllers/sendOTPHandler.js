const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();
const {collection, query, where, getDocs } = require("firebase/firestore");
const {firestore} = require("../utils/firebaseUtil")
const {encryptdata} = require("../utils/hashUtil")

// Temporary in-memory store for OTPs
const otpStore = new Map(); // { email: { otp, expiresAt } }

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MY_EMAIL, // Replace with your email
        pass: process.env.APP_PASSWORD, // Replace with your email password
    },
});

// Generate and send OTP
router.post("/", async (req, res) => {
    const { email, purpose } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        // Check if the email is already in use
        const usersRef = collection(firestore, "signup_data");
        const q = query(usersRef, where("2", "==", encryptdata(email)));
        const querySnapshot = await getDocs(q);

        if (!purpose && !querySnapshot.empty) {
            return res.status(400).json({ success: false, message: "Email is already in use." });
        }else if(purpose === "login" && querySnapshot.empty){
            return res.status(400).json({ success: false, message: "Email not found" });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        // Set OTP expiration (5 minutes from now)
        const expiresAt = Date.now() + 5 * 60 * 1000;
        // Store the OTP in memory
        otpStore.set(email, { otp, expiresAt });

        // Send OTP via email
        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP sent successfully." });
    } catch (error) {
        console.error("Error in sending OTP:", error.message);
        return res.status(500).json({ success: false, message: "Failed to send OTP.", error: error.message });
    }
});

// Verify OTP
router.post("/verify", (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required." });
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
        return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
    }

    const { otp: storedOtp, expiresAt } = storedOtpData;

    if (Date.now() > expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    otpStore.delete(email); // OTP verified, remove it from store
    res.json({ success: true, message: "OTP verified successfully." });
});

module.exports = router;
