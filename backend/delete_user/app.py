from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
users_collection = db.users
tasks_collection = db.tasks

@app.route('/delete_user', methods=['DELETE'])
def delete_user():
    try:
        data = request.json
        username = data.get('username')

        if not username:
            return jsonify({'error': 'Username is required'}), 400

        # Delete user
        user_result = users_collection.delete_one({'username': username})

        if user_result.deleted_count == 0:
            return jsonify({'error': 'User not found'}), 404

        # Delete tasks associated with the user
        tasks_result = tasks_collection.delete_many({'username': username})

        return jsonify({
            'message': 'User and associated tasks deleted successfully',
            'tasks_deleted': tasks_result.deleted_count
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4010)
