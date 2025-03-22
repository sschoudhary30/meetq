//contentModeration.js
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");

admin.initializeApp();
const db = admin.firestore();
const client = new vision.ImageAnnotatorClient();

// Google Vision Likelihood enums for comparison
const { Likelihood } = vision.protos.google.cloud.vision.v1;

// Function to analyze an image using Google Vision
async function analyzeImage(imageURL) {
    try {
        const [result] = await client.safeSearchDetection({
            image: { source: { imageUri: imageURL } }, // ✅ Corrected input
        });

        const detections = result.safeSearchAnnotation;
        console.log("🔍 Image Analysis:", detections);
        return detections;
    } catch (error) {
        console.error("❌ Error analyzing image:", error);
        return null;
    }
}

// Function to analyze caption (basic filtering example)
function analyzeCaption(caption) {
    const bannedWords = ["harassment", "hate", "violence"]; // Add more as needed
    return bannedWords.some((word) => caption.toLowerCase().includes(word));
}

// Function to check a reposted post
async function checkRepost(userId, postId) {
    try {
        // Get the original post details
        const postRef = db.collection("posts").doc(postId);
        const postSnap = await postRef.get();

        if (!postSnap.exists) {
            console.log("⚠️ Post not found.");
            return { status: "not_found" }; // ✅ Explicit return
        }

        const { caption, imageURL } = postSnap.data();
        console.log("🔄 Analyzing repost:", caption, imageURL);

        // Analyze the image
        const imageAnalysis = await analyzeImage(imageURL);
        const captionFlagged = analyzeCaption(caption);

        // Example: Block repost if image contains adult/violent content or caption is flagged
        if (
            imageAnalysis &&
            (imageAnalysis.adult === Likelihood.LIKELY ||
            imageAnalysis.violence === Likelihood.LIKELY ||
            captionFlagged)
        ) {
            console.log("🚫 Post contains inappropriate content. Blocking repost.");
            return { status: "blocked", reason: "Inappropriate content detected" };
        }

        console.log("✅ Post is safe to repost.");
        return { status: "allowed" };
    } catch (error) {
        console.error("❌ Error checking repost:", error);
        return { status: "error", reason: error.message };
    }
}

module.exports = { analyzeImage, analyzeCaption, checkRepost };



/*const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");

admin.initializeApp();
const db = admin.firestore();
const client = new vision.ImageAnnotatorClient();

// Function to analyze an image using Google Vision
async function analyzeImage(imageURL) {
    try {
        const [result] = await client.safeSearchDetection(imageURL);
        const detections = result.safeSearchAnnotation;

        console.log("Image Analysis:", detections);
        return detections;
    } catch (error) {
        console.error("Error analyzing image:", error);
        return null;
    }
}

// Function to analyze caption (basic filtering example)
function analyzeCaption(caption) {
    const bannedWords = ["harassment", "hate", "violence"]; // Add more as needed
    return bannedWords.some((word) => caption.toLowerCase().includes(word));
}

// Function to check a reposted post
async function checkRepost(userId, postId) {
    try {
        // Get the original post details
        const postRef = db.collection("posts").doc(postId);
        const postSnap = await postRef.get();

        if (!postSnap.exists) {
            console.log("Post not found.");
            return;
        }

        const { caption, imageURL } = postSnap.data();
        console.log("Analyzing repost:", caption, imageURL);

        // Analyze the image
        const imageAnalysis = await analyzeImage(imageURL);
        const captionFlagged = analyzeCaption(caption);

        // Example: Block repost if image contains adult/violent content or caption is flagged
        if (
            imageAnalysis.adult === "LIKELY" ||
            imageAnalysis.violence === "LIKELY" ||
            captionFlagged
        ) {
            console.log("Post contains inappropriate content. Blocking repost.");
            return { status: "blocked", reason: "Inappropriate content detected" };
        }

        console.log("Post is safe to repost.");
        return { status: "allowed" };
    } catch (error) {
        console.error("Error checking repost:", error);
    }
}

// Example usage
const userId = "M0w3z6AvX8ZIziyNPlV0n24I5RI3";
const postId = "TwF4YbVypkc3QvOlMzfE"; // Replace with actual post ID

checkRepost(userId, postId).then((result) => console.log(result));
*/