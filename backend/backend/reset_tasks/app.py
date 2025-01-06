from flask import Flask, jsonify
from pymongo import MongoClient
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# MongoDB configuration
client = MongoClient("mongodb://mongodb:27017/")
db = client.task_manager
tasks_collection = db.tasks

@app.route('/reset_tasks', methods=['DELETE'])
def reset_tasks():
    try:
        # Delete all tasks
        result = tasks_collection.delete_many({})
        return jsonify({'message': 'All tasks have been deleted', 'deleted_count': result.deleted_count}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'alive'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4007)
