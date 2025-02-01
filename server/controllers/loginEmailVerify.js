const express = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();
const admin = require("firebase-admin");
const {collection, query, where, getDocs } = require("firebase/firestore");
const {firestore} = require("../utils/firebaseUtil")
const {encryptdata} = require("../utils/hashUtil")



const getUserEmailFromUID = async (uid) => {
    try {
      const userRecord = await admin.auth().getUser(uid);
      return userRecord.email;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw new Error("Failed to fetch user email");
    }
  };

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
    const { account, type } = req.body;
    if (!account) {
        return res.status(400).json({ success: false, message: "Account username handle is required." });
    }

    try {
        
        let email = "";
        if(type === "personal"){
            // check if email exists
            const usersRefUser = collection(firestore, "signup_data");
            const q1 = query(usersRefUser, where("username", "==", encryptdata(account)));
            const querySnapshotq1 = await getDocs(q1);
            if (querySnapshotq1.empty) {
                return res.status(400).json({ success: false, message: "No such email exists, enter a valid account" });
            }
            email = account;
        }else{
            // check if username exists
            const usersRefUser = collection(firestore, "users");
            const q1 = query(usersRefUser, where("username", "==", account));
            const querySnapshotq1 = await getDocs(q1);
            if (querySnapshotq1.empty) {
                return res.status(400).json({ success: false, message: "No such username exists, enter a valid account" });
            }
            // Check and send email for verify
            email = await getUserEmailFromUID(querySnapshotq1.docs[0].id)
        }
        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiration (5 minutes from now)
        const expiresAt = Date.now() + 5 * 60 * 1000;
        // Store the OTP in memory
        otpStore.set(encryptdata(email), { otp, expiresAt });

        // Send OTP via email
        const mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP sent successfully.", email: encryptdata(email) });
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
