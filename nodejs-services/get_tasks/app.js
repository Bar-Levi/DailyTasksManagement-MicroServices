const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors"); // Import cors

const app = express();
const port = 5000;
app.use(cors()); // Add the CORS middleware

// MongoDB configuration
const mongoUrl = "mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager";
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

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find().toArray();
    res.status(200).json(tasks);
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
  console.log(`get_tasks service running on port ${port}`);
});
