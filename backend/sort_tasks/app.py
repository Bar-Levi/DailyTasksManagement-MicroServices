from flask import Flask, jsonify, request
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/sort_tasks', methods=['GET'])
def sort_tasks():
    try:
        # Get username from query parameters
        username = request.args.get('username')

        if not username:
            return jsonify({'error': 'Username is required to sort tasks'}), 400

        # Fetch tasks for the given username
        tasks = list(tasks_collection.find({'username': username}))

        # Convert 'due_hour' to datetime and sort
        for task in tasks:
            task['_id'] = str(task['_id'])  # Convert ObjectId to string
            task['due_hour'] = datetime.strptime(task['due_hour'], "%H:%M")
        
        tasks.sort(key=lambda x: x['due_hour'])

        # Convert 'due_hour' back to string for response
        for task in tasks:
            task['due_hour'] = task['due_hour'].strftime("%H:%M")

        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'alive'}), 200

# Helper function for testing to set a custom database
def set_db(database):
    global tasks_collection
    tasks_collection = database.tasks
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4006)
