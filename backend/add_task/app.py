from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# Enable CORS
CORS(app)

# Default MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks


@app.route('/add_task', methods=['POST'])
def add_task():
    try:
        data = request.json
        task_name = data.get('task_name')
        due_hour = data.get('due_hour')
        is_done = data.get('is_done', False)

        if not task_name or not due_hour:
            return jsonify({'error': 'Task name and due hour are required'}), 400

        task = {
            'task_name': task_name,
            'due_hour': due_hour,
            'is_done': is_done
        }

        result = tasks_collection.insert_one(task)
        return jsonify({'message': 'Task added', 'task_id': str(result.inserted_id)}), 201
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
    app.run(host='0.0.0.0', port=4000)