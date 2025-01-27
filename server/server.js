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

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the main server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
