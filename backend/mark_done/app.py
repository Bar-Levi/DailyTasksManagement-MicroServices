from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/mark_done/<task_id>', methods=['PUT'])
def mark_done(task_id):
    try:
        data = request.json
        print("data: ", data)
        # Check if the task exists and if it is already marked as done
        task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        # Update the is_done field to True
        result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': {'is_done': data["is_done"]}}
        )

        return jsonify({'message': 'Task marked as done successfully', 'data': data}), 200
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
    app.run(host='0.0.0.0', port=4003)
