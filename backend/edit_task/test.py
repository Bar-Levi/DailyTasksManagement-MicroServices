import pytest
import mongomock
from app import app, set_db
from bson.objectid import ObjectId

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

def test_health_check(client):
    # Act
    response = client.get('/health')

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['status'] == 'alive'

def test_edit_task_success(client):
    # Arrange
    task = {
        "task_name": "Original Task",
        "due_hour": "12:00",
        "username": "user1",
        "is_done": False
    }
    inserted_task = tasks_collection.insert_one(task)
    task_id = str(inserted_task.inserted_id)

    update_payload = {
        "task_name": "Updated Task",
        "due_hour": "13:00"
    }

    # Act
    response = client.put(f'/edit_task/{task_id}', json=update_payload)

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['message'] == 'Task updated successfully'

def test_edit_task_no_fields_to_update(client):
    # Arrange
    task = {
        "task_name": "Original Task",
        "due_hour": "12:00",
        "username": "user1",
        "is_done": False
    }
    inserted_task = tasks_collection.insert_one(task)
    task_id = str(inserted_task.inserted_id)

    update_payload = {}

    # Act
    response = client.put(f'/edit_task/{task_id}', json=update_payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'No valid fields to update'

def test_edit_task_update_is_done_not_allowed(client):
    # Arrange
    task = {
        "task_name": "Original Task",
        "due_hour": "12:00",
        "username": "user1",
        "is_done": False
    }
    inserted_task = tasks_collection.insert_one(task)
    task_id = str(inserted_task.inserted_id)

    update_payload = {
        "is_done": True
    }

    # Act
    response = client.put(f'/edit_task/{task_id}', json=update_payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Updating the is_done field is not allowed'

def test_edit_task_invalid_task_id(client):
    # Arrange
    invalid_task_id = "invalidtaskid"
    update_payload = {
        "task_name": "Updated Task"
    }

    # Act
    response = client.put(f'/edit_task/{invalid_task_id}', json=update_payload)

    # Assert
    assert response.status_code == 500
    response_data = response.get_json()
    assert 'error' in response_data

def test_edit_task_not_found(client):
    # Arrange
    valid_but_nonexistent_task_id = "64d9f99e9b1f58e1d67aaf4e"
    update_payload = {
        "task_name": "Updated Task"
    }

    # Act
    response = client.put(f'/edit_task/{valid_but_nonexistent_task_id}', json=update_payload)

    # Assert
    assert response.status_code == 404
    response_data = response.get_json()
    assert response_data['error'] == 'Task not found'
