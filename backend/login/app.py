from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
client = MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
db = client.task_manager
users_collection = db.users


@app.route('/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Username and password are required'}), 400

        user = users_collection.find_one({'username': username, 'password': password})
        if not user:
            return jsonify({'error': 'Invalid username or password'}), 400

        return jsonify({'message': 'Login successful'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4009)
