
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        # Get the username from the query parameters
        username = request.args.get('username')

        if not username:
            return jsonify({'error': 'Username is required'}), 400

        # Fetch tasks for the given username
        tasks = list(tasks_collection.find({'username': username}))
        for task in tasks:
            task['_id'] = str(task['_id'])  # Convert ObjectId to string

        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Helper function for testing to set a custom database
def set_db(database):
    global tasks_collection
    tasks_collection = database.tasks

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4004)