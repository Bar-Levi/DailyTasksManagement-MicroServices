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

def test_reset_tasks_success(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task": "Task 1"},
        {"username": username, "task": "Task 2"}
    ]
    tasks_collection.insert_many(tasks)

    payload = {"username": username}

    # Act
    response = client.delete('/reset_tasks', json=payload)

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['message'] == f'All tasks for user {username} have been deleted'
    assert response_data['deleted_count'] == len(tasks)

def test_reset_tasks_missing_username(client):
    # Arrange
    payload = {}

    # Act
    response = client.delete('/reset_tasks', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username is required to reset tasks'

def test_reset_tasks_no_tasks(client):
    # Arrange
    username = "notasksuser"
    payload = {"username": username}

    # Act
    response = client.delete('/reset_tasks', json=payload)

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['message'] == f'All tasks for user {username} have been deleted'
    assert response_data['deleted_count'] == 0
