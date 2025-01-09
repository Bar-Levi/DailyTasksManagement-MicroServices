import pytest
import mongomock
from app import app, set_db

# Mock MongoDB connection
@pytest.fixture(autouse=True)
def mock_mongo():
    with mongomock.patch(servers=("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager",)):
        mock_client = mongomock.MongoClient("mongodb+srv://ronybubnovsky:UX4st2u29gvKGqbu@taskmanager.qjg5t.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
        mock_db = mock_client.task_manager
        set_db(mock_db)  # Inject the mock database
        yield


# Pytest fixture to create a test client
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Fixture to clean the database before and after each test
@pytest.fixture(autouse=True)
def cleanup_database():
    # Access the mocked MongoDB database
    from app import tasks_collection
    task_ids = []  # Store the IDs of created tasks

    yield task_ids  # Provide task_ids to tests

    # Clean after each test by task ID
    for task_id in task_ids:
        tasks_collection.delete_one({"_id": task_id})


def test_add_task_success(client, cleanup_database):
    # Arrange
    payload = {
        "task_name": "Test Task",
        "due_hour": "14:00",
        "is_done": False
    }

    # Act
    response = client.post('/add_task', json=payload)

    # Assert
    assert response.status_code == 201
    response_data = response.get_json()
    assert response_data['message'] == 'Task added'
    assert 'task_id' in response_data

    # Store the task ID for cleanup
    task_id = response_data['task_id']
    from bson import ObjectId
    cleanup_database.append(ObjectId(task_id))  # Convert to ObjectId for MongoDB


def test_add_task_missing_fields(client):
    # Arrange
    payload = {"due_hour": "14:00"}  # Missing 'task_name'

    # Act
    response = client.post('/add_task', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Task name and due hour are required'


def test_add_task_invalid_json(client):
    # Act
    response = client.post('/add_task', data="invalid json")

    # Assert
    assert response.status_code == 500
    response_data = response.get_json()
    assert 'error' in response_data


def test_health_check(client):
    # Act
    response = client.get('/health')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['status'] == 'alive'
