const express = require("express");
const crypto = require("crypto");
const router = express.Router();
require("dotenv").config();
const { collection, query, where, doc, getDocs, getDoc, updateDoc, arrayUnion } = require("firebase/firestore");
const { firestore } = require("../utils/firebaseUtil")
const { encryptdata } = require("../utils/hashUtil")
const { generateRegistrationOptions, generateAuthenticationOptions, verifyRegistrationResponse, verifyAuthenticationResponse } = require("@simplewebauthn/server");


if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}
// Temporary in-memory store for challenges
const ChallengeStore = {} // { uid: { challenge } }

// Generate and send OTP
router.post("/", async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }
    try {
        // Check if the username exists
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(400).json({ success: false, message: "Enter valid username." });
        }

        const uid = querySnapshot.docs[0].id;
        const challengePayload = await generateRegistrationOptions({
            rpID: 'localhost', //frontend domain
            rpName: 'My Localhost Machine', // any application name
            userName: username,

        })

        ChallengeStore[uid] = { challenge: challengePayload.challenge, id: challengePayload.user.id };
        return res.json({ success: true, message: "Challenge created successfully.", options: { challengePayload } });
    } catch (error) {
        console.error("Error in register challenge:", error.message);
        return res.status(500).json({ success: false, message: "Failed to register challenge.", error: error.message });
    }
})

router.post("/verify", async (req, res) => {
    const { username, credentials, accountType } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }
    try {
        // Check if the username exists
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(400).json({ success: false, message: "Enter valid username." });
        }

        const uid = querySnapshot.docs[0].id;

        const verificationResponse = await verifyRegistrationResponse({
            expectedChallenge: ChallengeStore[uid].challenge,
            expectedOrigin: "http://localhost:5173",
            expectedRPID: "localhost",
            response: credentials
        })

        if (!verificationResponse.verified) return res.status(500).json({ success: false, message: "Failed to verify.", error: "error" });

        const { registrationInfo } = verificationResponse;
        const {
            credential,
            credentialDeviceType,
            credentialBackedUp,
        } = registrationInfo;

        const newPasskey = {
            // `user` here is from Step 2
            user: uid,
            // Created by `generateRegistrationOptions()` in Step 1
            webAuthnUserID: ChallengeStore[uid].id,
            // A unique identifier for the credential
            id: credential.id,
            // The public key bytes, used for subsequent authentication signature verification
            publicKey: Buffer.from(credential.publicKey).toString("base64"),
            // The number of times the authenticator has been used on this site so far
            counter: credential.counter,
            // How the browser can talk with this credential's authenticator
            transports: credential.transports,
            // Whether the passkey is single-device or multi-device
            deviceType: credentialDeviceType,
            // Whether the passkey has been backed up in some way
            backedUp: credentialBackedUp,
        };
        let querySnapshots;
        if (accountType === "PersonalPage") {
            // get user store
            const usersRefsign_up = doc(firestore, "signup_data", encryptdata(username));
            querySnapshots = await getDoc(usersRefsign_up);
        }
        else {
            // Check user store(fan)
            const usersRefsign_up = doc(firestore, "fan_accounts", uid);
            querySnapshots = await getDoc(usersRefsign_up);
        }

        await updateDoc(querySnapshots.ref, {
            passKey: arrayUnion(newPasskey),
        });
        return res.json({ success: true, message: "Challenge verified successfully." });
    } catch (error) {
        console.error("Error in register challenge:", error.message);
        return res.status(500).json({ success: false, message: "Failed to verify challenge.", error: error.message });
    }
})

router.post("/login-challenge", async (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }
    try {
        // Check if the username exists
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(400).json({ success: false, message: "Enter valid username." });
        }

        const uid = querySnapshot.docs[0].id;
        const accountType = querySnapshot.docs[0].data().accountType;

        //get all existing passkeys
        var usersRef_data;
        if(accountType === "PersonalPage"){
            usersRef_data = doc(firestore, "signup_data", encryptdata(username));
        }else{
            usersRef_data = doc(firestore, "fan_accounts", uid);
        }
        
        const querySnapshots = await getDoc(usersRef_data);
        const passkeyArray = querySnapshots.data().passKey;

        const challengePayload = await generateAuthenticationOptions({
            rpID: 'localhost', //frontend domain
            allowCredentials: passkeyArray.map(passkey => ({
                id: passkey.id,
                transports: passkey.transports,
            })),
        });

        ChallengeStore[uid] = challengePayload.challenge;
        return res.json({ success: true, message: "Challenge created successfully.", options: { challengePayload } });
    } catch (error) {
        console.error("Error in register challenge:", error.message);
        return res.status(500).json({ success: false, message: "Failed to register challenge.", error: error.message });
    }
})

router.post("/login-challenge-verify", async (req, res) => {
    const { username, credentials } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username is required." });
    }

    try {
        // Check if the username exists
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(400).json({ success: false, message: "Enter valid username." });
        }

        // get uid of user
        const uid = querySnapshot.docs[0].id;
        const accountType = querySnapshot.docs[0].data().accountType;

        //get passkeys
        var usersRef_get_passkey;
        if(accountType === "PersonalPage"){
            usersRef_get_passkey = doc(firestore, "signup_data", encryptdata(username));
        }else{
            usersRef_get_passkey = doc(firestore, "fan_accounts", uid);
        }
        const querySnapshot_get_passkey = await getDoc(usersRef_get_passkey);

        if (querySnapshot_get_passkey.empty) {
            return res.status(400).json({ success: false, message: "Enter valid username." });
        }

        const userData = querySnapshot_get_passkey.data()

        // Check if passkeys array exists
        if (!userData.passKey || userData.passKey.length === 0) {
            return res.status(400).json({ success: false, message: "No passkeys found for this user. Login by email!!" });
        }

        const passkey = userData.passKey.find(p => p.id === credentials.id);

        if (!passkey) {
            return res.status(400).json({ success: false, message: "Passkey not found" });
        }

        // Extract rawId from credentials and decode it
        const rawId = new Uint8Array(Buffer.from(passkey.publicKey, "base64"));

        // Pass the correct authenticator to the verification process
        const verificationResponse = await verifyAuthenticationResponse({
            expectedChallenge: ChallengeStore[uid],
            expectedOrigin: "http://localhost:5173",
            expectedRPID: "localhost",
            response: credentials,
            credential: {
                id: passkey.id,
                publicKey: rawId,
                counter: passkey.counter,
                transports: passkey.transports
            }
        });

        if (!verificationResponse.verified) {
            return res.status(500).json({ success: false, message: "Failed to verify authentication." });
        }
        return res.json({ success: true, message: "Authentication verified successfully." });
    } catch (error) {
        console.error("Error verifying authentication challenge:", error.message);
        return res.status(500).json({ success: false, message: "Failed to verify challenge.", error: error.message });
    }
});


module.exports = router;