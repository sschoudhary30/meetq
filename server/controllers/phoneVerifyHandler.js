const express = require("express");
const router = express.Router();
require("dotenv").config();
const {collection, query, where, getDocs } = require("firebase/firestore");
const {firestore} = require("../utils/firebaseUtil")
const {encryptdata} = require("../utils/hashUtil")

// textflow
// const textflow = require("textflow.js");
// textflow.useKey("RH2TluLAWY4VT5IjAw6SKp6c17GjE5GDGtjw7ruoSOIoMUavoBVy4XPs6v532d0V");

// Temporary in-memory store for OTPs
const otpStore = new Map(); // { phoneNumber: { otp, expiresAt } }

// Generate and send OTP
router.post("/", async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber || phoneNumber.length < 12 || phoneNumber.length > 12) {
        return res.status(400).json({ success: false, message: "Valid phone number is required." });
    }

    try {
        // Check if the phone number is already in use
        const usersRef = collection(firestore, "signup_data");
        const q = query(usersRef, where("1", "==", encryptdata(phoneNumber)));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            return res.status(400).json({ success: false, message: "Phone number is already in use." });
        }
        /*//using testflow
        //User has sent his phone number for verification
        const result = await textflow.sendVerificationSMS(phoneNumber);
        console.log(result)
        if (result.ok) {

            // Generate a 6-digit OTP
            const otp = result.data?.verification_code;

            // Set OTP expiration (5 minutes from now)
            const expiresAt = result.data?.expires;
            // Store the OTP in memory
            otpStore.set(phoneNumber, { otp, expiresAt });
            return res.status(200).json({ success: true, message: result.message })
        } else {
            return res.status(500).json({ success: false, message: "Failed to send OTP.", error: result.message });
        }*/

        /*// sending whatsapp message

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiration (5 minutes from now)
        const expiresAt = Date.now() + 5 * 60 * 1000;

        // Store the OTP in memory
        otpStore.set(phoneNumber, { otp, expiresAt });
        const response = await axios({
            url:`https://graph.facebook.com/v21.0/549441428253298/messages `,
            method: "post",
            headers: {
                'Authorization': `Bearer EAAWgYEc2RjEBOZChJ7Jddx2FZCH27ef6Giv3bH09ZA71xzpfxuy8ND6fnZB4DFU5rT6oOrwEuqGDlk5QVUz09XQ2cE5Q3O5U7NLXi7FifBQ5VJAtR0L1XhpMqdBp4fFZCYInlbZAX4727kw2ST7CsGmHD5qVO41inqL5gWxyDlzwPzCEZBlMDheJsX0fKWInRZCWBSd11GifHZBNaoGJWIa1MZBKHIrPtVwCvYztsZD`,
                'Content-Type': "application/json"
            },
            data: JSON.stringify({
                messaging_product:'whatsapp',
                to: phoneNumber,
                type: 'template',
                template:{
                    name: 'meetq_verify',
                    language:{
                        code: 'en_US'
                    },
                    components:[
                        {
                            type: 'body',
                            parameters: [
                                {
                                    type: 'text',
                                    text: otp
                                }
                            ]
                        }
                    ]
                }
            })
        })*/
        //will use send2sms later
        // Generate a 6-digit OTP
        const otp = "123456";

        // Set OTP expiration (5 minutes from now)
        const expiresAt = Date.now() + 5 * 60 * 1000;

        // Store the OTP in memory
        otpStore.set(phoneNumber, { otp, expiresAt });

        return res.status(200).json({success: true, message: "OTP sent successfully"});
    }catch(error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Failed to send OTP.", error: error.message });
    }
});

// Verify OTP
router.post("/verify", async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ success: false, message: "Phone number and OTP are required." });
    }

    const storedOtpData = otpStore.get(phoneNumber);

    if (!storedOtpData) {
        return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
    }

    const { otp: storedOtp, expiresAt } = storedOtpData;

    if (Date.now() > expiresAt) {
        otpStore.delete(phoneNumber);
        return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    otpStore.delete(phoneNumber); // OTP verified, remove it from store
    res.json({ success: true, message: "OTP verified successfully." });
});

module.exports = router;
