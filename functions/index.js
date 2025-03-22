const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const client = new ImageAnnotatorClient();

// Initialize Firebase Admin SDK
admin.initializeApp();

// Cloud Function to trigger when a report is added
exports.analyzeReportedPost = functions.firestore
    .document('reports/{reportId}')
    .onCreate(async (snap, context) => {
        // Get the data of the report
        const reportData = snap.data();
        const postId = reportData.postId;
        const imageUrl = reportData.imageURL; // URL of the image to analyze
        
        console.log(`Analyzing image for post: ${postId}, image URL: ${imageUrl}`);

        try {
            // Request the image analysis from Google Vision API
            const [result] = await client.safeSearchDetection(imageUrl);
            const safeSearch = result.safeSearchAnnotation;
            
            // Log the results of the analysis
            console.log('SafeSearch analysis:', safeSearch);

            // Determine whether the image is safe
            let imageStatus = 'SAFE';
            if (safeSearch.adult >= 3 || safeSearch.violence >= 3) {
                imageStatus = 'NOT SAFE';
            }

            // Save the result back to the report or post (depending on your requirements)
            await admin.firestore().collection('reports').doc(context.params.reportId).update({
                imageStatus: imageStatus,
                visionAnalysis: safeSearch,
            });

            console.log(`Image analyzed. Status: ${imageStatus}`);
            
        } catch (error) {
            console.error('Error analyzing image:', error);
        }
    });
