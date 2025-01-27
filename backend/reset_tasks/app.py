from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/reset_tasks', methods=['DELETE'])
def reset_tasks():
    try:
        # Get username from the request body
        data = request.json
        username = data.get('username')
        
        print(f"Resetting tasks for username: {username}")

        if not username:
            return jsonify({'error': 'Username is required to reset tasks'}), 400

        # Delete tasks for the given username
        result = tasks_collection.delete_many({'username': username})
        return jsonify({
            'message': f'All tasks for user {username} have been deleted',
            'deleted_count': result.deleted_count
        }), 200
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
    app.run(host='0.0.0.0', port=4007)
