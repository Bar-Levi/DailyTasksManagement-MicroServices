from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/sync', methods=['GET', 'POST'])
def mock_service():
    return jsonify({'message': 'This is a future service: sync_tasks Google Calendar'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004) 
