import pytest
import mongomock
from datetime import datetime
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

def test_sort_tasks_success(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task_name": "Task 1", "due_hour": "14:00"},
        {"username": username, "task_name": "Task 2", "due_hour": "12:00"}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/sort_tasks?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == len(tasks)
    assert response_data[0]['due_hour'] == "12:00"
    assert response_data[1]['due_hour'] == "14:00"

def test_sort_tasks_no_tasks(client):
    # Arrange
    username = "notasksuser"

    # Act
    response = client.get(f'/sort_tasks?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == 0

def test_sort_tasks_missing_username(client):
    # Act
    response = client.get('/sort_tasks')

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username is required to sort tasks'

def test_sort_tasks_already_sorted(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task_name": "Task 1", "due_hour": "10:00"},
        {"username": username, "task_name": "Task 2", "due_hour": "12:00"}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/sort_tasks?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == len(tasks)
    assert response_data[0]['due_hour'] == "10:00"
    assert response_data[1]['due_hour'] == "12:00"

def test_sort_tasks_invalid_due_hour_format(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task_name": "Task 1", "due_hour": "invalid_time"}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/sort_tasks?username={username}')

    # Assert
    assert response.status_code == 500
    response_data = response.get_json()
    assert 'error' in response_data
