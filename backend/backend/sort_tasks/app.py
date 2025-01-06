from flask import Flask, jsonify
from pymongo import MongoClient
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb://mongodb:27017/")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/sort_tasks', methods=['GET'])
def sort_tasks():
    try:
        # Fetch all tasks
        tasks = list(tasks_collection.find())

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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4006)
