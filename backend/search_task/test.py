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

def test_search_task_by_username(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task_name": "Task 1", "due_hour": "12:00"},
        {"username": username, "task_name": "Task 2", "due_hour": "14:00"}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/search_task?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == len(tasks)

def test_search_task_by_username_and_task_name(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task_name": "Important Task", "due_hour": "12:00"},
        {"username": username, "task_name": "Another Task", "due_hour": "14:00"}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/search_task?username={username}&task_name=important')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == 1
    assert response_data[0]['task_name'] == "Important Task"

def test_search_task_by_username_and_due_hour(client):
    # Arrange
    username = "testuser"
    tasks = [
        {"username": username, "task_name": "Task 1", "due_hour": "12:00"},
        {"username": username, "task_name": "Task 2", "due_hour": "14:00"}
    ]
    tasks_collection.insert_many(tasks)

    # Act
    response = client.get(f'/search_task?username={username}&due_hour=14:00')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == 1
    assert response_data[0]['due_hour'] == "14:00"

def test_search_task_missing_username(client):
    # Act
    response = client.get('/search_task')

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username is required to search tasks'

def test_search_task_no_matching_tasks(client):
    # Arrange
    username = "nonexistentuser"

    # Act
    response = client.get(f'/search_task?username={username}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert len(response_data) == 0
