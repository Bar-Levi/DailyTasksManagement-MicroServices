from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/remove_task/<task_id>', methods=['DELETE'])
def remove_task(task_id):
    try:
        # Attempt to delete the task by its ID
        result = tasks_collection.delete_one({'_id': ObjectId(task_id)})

        if result.deleted_count == 0:
            return jsonify({'error': 'Task not found'}), 404

        return jsonify({'message': 'Task removed successfully'}), 200
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
    app.run(host='0.0.0.0', port=4001)
