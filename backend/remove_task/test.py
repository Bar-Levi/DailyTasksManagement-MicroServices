import pytest
import mongomock
from bson.objectid import ObjectId
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

def test_remove_task_success(client):
    # Arrange
    task = {"_id": ObjectId(), "name": "Sample Task", "completed": False}
    tasks_collection.insert_one(task)

    # Act
    response = client.delete(f'/remove_task/{task["_id"]}')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['message'] == 'Task removed successfully'

def test_remove_task_not_found(client):
    # Arrange
    non_existent_id = ObjectId()

    # Act
    response = client.delete(f'/remove_task/{non_existent_id}')

    # Assert
    assert response.status_code == 404
    response_data = response.get_json()
    assert response_data['error'] == 'Task not found'

def test_remove_task_invalid_id(client):
    # Arrange
    invalid_id = "12345"

    # Act
    response = client.delete(f'/remove_task/{invalid_id}')

    # Assert
    assert response.status_code == 500
    response_data = response.get_json()
    assert 'error' in response_data
