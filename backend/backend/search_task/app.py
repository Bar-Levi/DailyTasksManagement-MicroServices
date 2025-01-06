from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb://mongodb:27017/")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/search_task', methods=['GET'])
def search_task():
    try:
        # Get query parameters
        task_name = request.args.get('task_name')
        due_hour = request.args.get('due_hour')

        # Build the query dynamically
        query = {}
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
