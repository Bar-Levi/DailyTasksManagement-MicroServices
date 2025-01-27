import pytest
import mongomock
from app import app, set_db

# Mock MongoDB connection
@pytest.fixture(autouse=True)
def mock_mongo():
    with mongomock.patch():
        mock_client = mongomock.MongoClient()
        mock_db = mock_client.task_manager

        global users_collection
        users_collection = mock_db.users

        set_db(mock_db)  # Set the mocked database
        app.config['TESTING'] = True
        yield

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_register_user_success(client):
    # Arrange
    payload = {
        "username": "newuser",
        "password": "newpassword"
    }

    # Act
    response = client.post('/register', json=payload)

    # Assert
    assert response.status_code == 201
    response_data = response.get_json()
    assert response_data['message'] == 'User registered successfully'

def test_register_user_existing_username(client):
    # Arrange
    existing_user = {
        "username": "existinguser",
        "password": "password123"
    }
    users_collection.insert_one(existing_user)

    payload = {
        "username": "existinguser",
        "password": "newpassword"
    }

    # Act
    response = client.post('/register', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username already exists'

def test_register_user_missing_fields(client):
    # Arrange
    payload = {
        "username": "newuser"
    }

    # Act
    response = client.post('/register', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username and password are required'
