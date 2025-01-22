from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
users_collection = db.users

@app.route('/')
def hello():
    return 'Hello'

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        print(username, password)
        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        if users_collection.find_one({'username': username}):
            return jsonify({'error': 'Username already exists'}), 400

        users_collection.insert_one({'username': username, 'password': password})
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Helper function for testing to set a custom database
def set_db(database):
    global tasks_collection
    tasks_collection = database.tasks


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4008)
