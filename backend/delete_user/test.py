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

def test_delete_user_success(client):
    # Arrange
    from app import users_collection, tasks_collection

    username = "testuser"
    users_collection.insert_one({"username": username, "email": "testuser@example.com"})
    tasks_collection.insert_many([
        {"task_name": "Task 1", "username": username},
        {"task_name": "Task 2", "username": username}
    ])

    payload = {"username": username}

    # Act
    response = client.delete('/delete_user', json=payload)

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['message'] == 'User and associated tasks deleted successfully'
    assert response_data['tasks_deleted'] == 2

def test_delete_user_not_found(client):
    # Arrange
    payload = {"username": "nonexistentuser"}

    # Act
    response = client.delete('/delete_user', json=payload)

    # Assert
    assert response.status_code == 404
    response_data = response.get_json()
    assert response_data['error'] == 'User not found'

def test_delete_user_missing_username(client):
    # Arrange
    payload = {}

    # Act
    response = client.delete('/delete_user', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username is required'

def test_delete_user_invalid_json(client):
    # Act
    response = client.delete('/delete_user', data="invalid json")

    # Assert
    assert response.status_code == 500
    response_data = response.get_json()
    assert 'error' in response_data
