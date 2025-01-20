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

def test_login_user_success(client):
    # Arrange
    user = {
        "username": "testuser",
        "password": "testpass"
    }
    users_collection.insert_one(user)

    payload = {
        "username": "testuser",
        "password": "testpass"
    }

    # Act
    response = client.post('/login', json=payload)

    # Assert
    assert response.status_code == 200
    response_data = response.get_json()
    assert response_data['message'] == 'Login successful'

def test_login_user_invalid_credentials(client):
    # Arrange
    user = {
        "username": "testuser",
        "password": "testpass"
    }
    users_collection.insert_one(user)

    payload = {
        "username": "testuser",
        "password": "wrongpass"
    }

    # Act
    response = client.post('/login', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Invalid username or password'

def test_login_user_missing_fields(client):
    # Arrange
    payload = {
        "username": "testuser"
    }

    # Act
    response = client.post('/login', json=payload)

    # Assert
    assert response.status_code == 400
    response_data = response.get_json()
    assert response_data['error'] == 'Username and password are required'
