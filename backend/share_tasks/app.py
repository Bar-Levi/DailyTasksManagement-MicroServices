from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def mock_service():
    return jsonify({'message': 'This is a future service: share_tasks'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  
