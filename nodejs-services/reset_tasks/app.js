const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import cors

const app = express();
const port = 5001;
app.use(cors()); // Add the CORS middleware
app.use(express.json()); // Middleware to parse JSON request body

// MongoDB configuration
const mongoUrl =
  "mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager";
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

// Reset all tasks for a specific username
app.delete("/reset_tasks", async (req, res) => {
  try {
    const { username } = req.body; // Extract username from request body

    if (!username) {
      return res.status(400).json({ error: "Username is required to reset tasks" });
    }

    // Delete tasks for the given username
    const result = await tasksCollection.deleteMany({ username });
    res.status(200).json({
      message: `All tasks for user ${username} have been deleted`,
      deletedCount: result.deletedCount,
    });
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
