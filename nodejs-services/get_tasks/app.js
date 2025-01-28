const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5007;

app.use(cors());

let tasksCollection;

// MongoDB connection setup
async function connectToDatabase(mongoUrl, dbName) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  tasksCollection = db.collection("tasks");
  console.log("Connected to MongoDB");
}

// Allow injecting a custom tasksCollection for tests
function setTasksCollection(mockCollection) {
  tasksCollection = mockCollection;
}

// Routes
app.get("/tasks", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required to fetch tasks" });
    }

    const tasks = await tasksCollection.find({ username }).toArray();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "alive" });
});

// Start server only if script is executed directly
if (require.main === module) {
  const mongoUrl =
    "mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager";
  const dbName = "task_manager";
  connectToDatabase(mongoUrl, dbName).then(() => {
    app.listen(port, () => {
      console.log(`get_tasks service running on port ${port}`);
    });
  });
}

module.exports = { app, setTasksCollection };
