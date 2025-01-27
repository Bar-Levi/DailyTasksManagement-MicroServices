const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

let tasksCollection;

// Connect to MongoDB
async function connectToDatabase(mongoUrl, dbName) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  tasksCollection = db.collection("tasks");
  console.log("Connected to MongoDB");
}

// Allow injecting a mock collection for testing
function setTasksCollection(mockCollection) {
  tasksCollection = mockCollection;
}

// Reset all tasks for a specific username
app.delete("/reset_tasks", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required to reset tasks" });
    }

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

// Start the server only if this script is executed directly
if (require.main === module) {
  const mongoUrl =
    "mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager";
  const dbName = "task_manager";

  connectToDatabase(mongoUrl, dbName).then(() => {
    app.listen(port, () => {
      console.log(`reset_tasks service running on port ${port}`);
    });
  });
}

module.exports = { app, setTasksCollection };
