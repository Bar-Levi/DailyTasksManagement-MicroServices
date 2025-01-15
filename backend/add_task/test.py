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

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_add_task_success(client):
    # Arrange
    payload = {
        "task_name": "Test Task",
        "due_hour": "14:00",
        "username": "testuser",
        "is_done": False
    }

    # Act
    response = client.post('/add_task', json=payload)

    # Assert
    assert response.status_code == 201
    response_data = response.get_json()
    assert response_data['message'] == 'Task added'
    assert 'task_id' in response_data

def test_add_task_missing_fields(client):
    # Arrange
    payload = {
        "due_hour": "14:00"
    }

    # Act
    response = client.post('/add_task', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Task name, due hour, and username are required'

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

def test_add_task_duplicate_username(client):
    # Arrange
    payload = {
        "task_name": "Test Task",
        "due_hour": "14:00",
        "username": "duplicateuser",
        "is_done": False
    }

    client.post('/add_task', json=payload)

    # Act
    response = client.post('/add_task', json=payload)

    # Assert
    assert response.status_code == 201  # Duplicate tasks with the same username should still be allowed
    response_data = response.get_json()
    assert response_data['message'] == 'Task added'
    assert 'task_id' in response_data

def test_add_task_with_extra_fields(client):
    # Arrange
    payload = {
        "task_name": "Test Task",
        "due_hour": "14:00",
        "username": "testuser",
        "is_done": False,
        "extra_field": "extra_value"
    }

    # Act
    response = client.post('/add_task', json=payload)

    # Assert
    assert response.status_code == 201
    response_data = response.get_json()
    assert response_data['message'] == 'Task added'
    assert 'task_id' in response_data
