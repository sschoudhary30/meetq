//analyzeImage.js
const vision = require('@google-cloud/vision');

// Creates a client using Application Default Credentials
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'meetq-449218-65a83ba48b73.json'
});

// Function to analyze the image for NSFW content
async function analyzeImage(imageURL) {
  console.log("🟢 analyzeImage function called with URL:", imageURL);

  const request = {
    image: {
      source: { imageUri: imageURL },
    },
    features: [{ type: "SAFE_SEARCH_DETECTION" }],
  };

  try {
    // Call the Google Vision API to analyze the image
    const [result] = await client.annotateImage({ requests: [request] });
    const safeSearchResult = result.responses[0]?.safeSearchAnnotation || null;

    if (!safeSearchResult) {
      console.error("⚠️ No NSFW data found in response.");
      return null;
    }

    return safeSearchResult;
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    return null;
  }
}

// Export the analyzeImage function
module.exports = { analyzeImage };




/*
// Import the Google Cloud client library
import vision from "@google-cloud/vision";

// Create a Vision API client using Application Default Credentials
const client = new vision.ImageAnnotatorClient();

async function analyzeImage(imageURL) {
  console.log("🟢 analyzeImage function called with URL:", imageURL);

  const request = {
    image: { source: { imageUri: imageURL } },
    features: [{ type: "SAFE_SEARCH_DETECTION" }],
  };

  try {
    const [response] = await client.annotateImage({ requests: [request] });
    console.log("🔍 NSFW API Response:", JSON.stringify(response, null, 2));

    const safeSearchResult = response.responses[0]?.safeSearchAnnotation || null;

    if (!safeSearchResult) {
      console.error("⚠️ No NSFW data found in response.");
      alert("⚠️ No NSFW data found in response.");
    }

    return safeSearchResult;
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    alert("❌ Google Vision API request failed! Check console.");
    return null;
  }
}

export { analyzeImage };

*/


/*import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_PRIVATE_KEY
                ? import.meta.env.VITE_GOOGLE_AI_PRIVATE_KEY.replace(/\n/g, "") 
                : null; // If not defined, set API_KEY to null


// Check if API_KEY is null and throw an error if necessary
if (!API_KEY) {
  console.error("⚠️ Google AI API Key is not defined in the environment variables.");
  throw new Error("Google AI API Key is required.");
}

const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

async function analyzeImage(imageURL) {
  console.log("🟢 analyzeImage function called with URL:", imageURL); // Log before API call

  const requestPayload = {
    requests: [
      {
        image: {
          source: {
            imageUri: imageURL,
          },
        },
        features: [
          {
            type: "SAFE_SEARCH_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(VISION_API_URL, requestPayload);
    console.log("🔍 NSFW API Response:", JSON.stringify(response.data, null, 2)); // Log full API response

    const safeSearchResult = response.data.responses[0]?.safeSearchAnnotation || null;

    if (!safeSearchResult) {
      console.error("⚠️ No NSFW data found in response.");
      alert("⚠️ No NSFW data found in response."); // Force alert
    }

    return safeSearchResult;
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    alert("❌ Google Vision API request failed! Check console.");
    return null;
  }
}

export { analyzeImage };

*/









/*import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_AI_PRIVATE_KEY.replace(/\n/g, ""); 
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

async function analyzeImage(imageURL) {
  console.log("🟢 analyzeImage function called with URL:", imageURL); // Log before API call

  const requestPayload = {
    requests: [
      {
        image: {
          source: {
            imageUri: imageURL,
          },
        },
        features: [
          {
            type: "SAFE_SEARCH_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(VISION_API_URL, requestPayload);
    console.log("🔍 NSFW API Response:", JSON.stringify(response.data, null, 2)); // Log full API response

    const safeSearchResult = response.data.responses[0]?.safeSearchAnnotation || null;

    if (!safeSearchResult) {
      console.error("⚠️ No NSFW data found in response.");
      alert("⚠️ No NSFW data found in response."); // Force alert
    }

    return safeSearchResult;
  } catch (error) {
    console.error("❌ Error analyzing image:", error);
    alert("❌ Google Vision API request failed! Check console.");
    return null;
  }
}

export { analyzeImage };
*/