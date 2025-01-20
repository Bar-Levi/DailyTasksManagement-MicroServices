import pytest
import mongomock
from app import app, set_db

# Mock MongoDB connection
@pytest.fixture(autouse=True)
def mock_mongo():
    with mongomock.patch():
        mock_client = mongomock.MongoClient()
        mock_db = mock_client.task_manager

        global tasks_collection
        tasks_collection = mock_db.tasks

        set_db(mock_db)  # Set the mocked database
        app.config['TESTING'] = True
        yield

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_get_tasks_success(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"task_name": "Task 1", "due_hour": "12:00", "username": username, "is_done": False},
        {"task_name": "Task 2", "due_hour": "14:00", "username": username, "is_done": True}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/tasks?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == 2
    assert response_data[0]['task_name'] == "Task 1"
    assert response_data[1]['task_name'] == "Task 2"

def test_get_tasks_missing_username(client):
    # Act
    response = client.get('/tasks')

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username is required'

def test_get_tasks_no_tasks_found(client):
    # Arrange
    username = "unknownuser"

    # Act
    response = client.get(f'/tasks?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data == []