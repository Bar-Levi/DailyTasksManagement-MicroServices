import pytest
from app import app, set_db
from mongomock import MongoClient
from bson.objectid import ObjectId


@pytest.fixture
def client():
    # Set up a test database using mongomock
    test_client = MongoClient()
    test_db = test_client.test_task_manager
    set_db(test_db)

    # Add sample task to the mock database
    sample_task = {
        "_id": ObjectId("64d49e2b70a1a5e8c1234567"),
        "title": "Test Task",
        "is_done": False
    }
    test_db.tasks.insert_one(sample_task)

    # Create a Flask test client
    with app.test_client() as client:
        yield client


def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.get_json() == {'status': 'alive'}


def test_mark_done_success(client):
    task_id = "64d49e2b70a1a5e8c1234567"
    response = client.put(f'/mark_done/{task_id}', json={"is_done": True})
    assert response.status_code == 200
    assert response.get_json() == {
        'message': 'Task marked as done successfully',
        'data': {"is_done": True}
    }


def test_mark_done_task_not_found(client):
    task_id = "64d49e2b70a1a5e8c1234568"  # Non-existent task ID
    response = client.put(f'/mark_done/{task_id}', json={"is_done": True})
    assert response.status_code == 404
    assert response.get_json() == {'error': 'Task not found'}


def test_mark_done_invalid_id(client):
    task_id = "invalid_object_id"
    response = client.put(f'/mark_done/{task_id}', json={"is_done": True})
    assert response.status_code == 500
    assert 'error' in response.get_json()
