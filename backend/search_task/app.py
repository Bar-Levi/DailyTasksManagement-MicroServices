from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/search_task', methods=['GET'])
def search_task():
    try:
        # Get query parameters
        username = request.args.get('username')  # Get username from query params
        task_name = request.args.get('task_name')
        due_hour = request.args.get('due_hour')

        if not username:
            return jsonify({'error': 'Username is required to search tasks'}), 400

        # Build the query dynamically
        query = {'username': username}  # Include username in the query
        if task_name:
            query['task_name'] = {'$regex': task_name, '$options': 'i'}  # Case-insensitive search
        if due_hour:
            query['due_hour'] = due_hour

        # Search for tasks matching the query
        tasks = list(tasks_collection.find(query))
        for task in tasks:
            task['_id'] = str(task['_id'])  # Convert ObjectId to string

        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'alive'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4005)
