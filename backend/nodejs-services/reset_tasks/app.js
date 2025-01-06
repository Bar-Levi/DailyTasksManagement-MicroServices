const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import cors


const app = express();
const port = 5001;
app.use(cors()); // Add the CORS middleware

// MongoDB configuration
const mongoUrl = "mongodb://mongodb:27017";
const dbName = "task_manager";

let db, tasksCollection;

// Connect to MongoDB
MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    tasksCollection = db.collection("tasks");
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Reset all tasks
app.delete("/reset_tasks", async (req, res) => {
  try {
    const result = await tasksCollection.deleteMany({});
    res.status(200).json({ message: "All tasks have been deleted", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "alive" });
});

// Start the server
app.listen(port, () => {
  console.log(`reset_tasks service running on port ${port}`);
});
