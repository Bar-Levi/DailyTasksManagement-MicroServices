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

@app.route('/edit_task/<task_id>', methods=['PUT'])
def edit_task(task_id):
    try:
        data = request.json
        # Fields to update (exclude 'is_done')
        updated_fields = {}
        if 'task_name' in data:
            updated_fields['task_name'] = data['task_name']
        if 'due_hour' in data:
            updated_fields['due_hour'] = data['due_hour']

        if 'is_done' in data:
            return jsonify({'error': 'Updating the is_done field is not allowed'}), 400

        if not updated_fields:
            return jsonify({'error': 'No valid fields to update'}), 400

        # Update task in MongoDB
        result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': updated_fields}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'Task not found'}), 404

        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'alive'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4002)
