
# Task Management System

## **Overview**
The Task Management System is a microservices-based application designed to help users efficiently manage their daily tasks. The system provides features for creating, editing, deleting, and marking tasks as complete. It also includes a user management module for registration, login, and user deletion.

---

## **Purpose**
The main goal of this project is to demonstrate the use of microservices architecture with Flask and Node.js for backend services, MongoDB Atlas as the database, and React for the frontend. The project uses Docker to containerize each service for scalability and ease of deployment.

---

## **Features**

### **Task Management**
- Add tasks with a name, due hour, and status.
- Edit tasks (excluding status).
- Delete tasks individually or reset all tasks.
- Search for tasks by name or due hour.
- Sort tasks by due hour.
- Mark tasks as completed.

### **User Management**
- Register new users.
- Login existing users.
- Delete users.

### **Advanced Features (Future Implementation)**
- Task analysis and insights.
- Task sharing with other users.
- Synchronization with external calendars like Google Calendar.

---

## **Technologies Used**
- **Backend**: Flask (Python) and Node.js
- **Frontend**: React with TailwindCSS
- **Database**: MongoDB Atlas
- **Containerization**: Docker
- **API Communication**: REST

---

## **System Requirements**
- **Operating System**: Windows/Mac/Linux
- **Docker**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop) (required for running the containers)
- **Node.js**: Version 14 or above (for local frontend testing)

---

## **Setup and Installation**

### **Step 1: Clone the Repository**
```bash
git clone <repository_url>
cd <repository_name>
```

### **Step 2: Ensure Docker Desktop is Running**
- Make sure Docker Desktop is installed and running on your system.

### **Step 3: Run the System Using Docker Compose**
```bash
docker-compose up --build
```

This command will:
- Build and start all backend services.
- Start the frontend React application.
- Connect to MongoDB Atlas.

### **Step 4: Access the Application**
- Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## **Services Overview**

### **Backend Services**
- **Task Services**:
  - `add_task` (port: 4000)
  - `remove_task` (port: 4001)
  - `edit_task` (port: 4002)
  - `mark_done` (port: 4003)
  - `get_tasks` (port: 4004)
  - `search_tasks` (port: 4005)
  - `sort_tasks` (port: 4006)
  - `reset_tasks` (port: 4007)

- **User Services**:
  - `register` (port: 4008)
  - `login` (port: 4009)
  - `delete_user` (port: 4010)

- **Node.js Services**:
  - `get_tasks_nodejs` (port: 5000)
  - `reset_tasks_nodejs` (port: 5001)

---

## **Directory Structure**
```
|-- backend/
|   |-- add_task/
|   |-- remove_task/
|   |-- edit_task/
|   |-- mark_done/
|   |-- get_tasks/
|   |-- search_task/
|   |-- sort_tasks/
|   |-- reset_tasks/
|   |-- register/
|   |-- login/
|   |-- delete_user/
|-- nodejs-services/
|   |-- get_tasks/
|   |-- reset_tasks/
|-- frontend/
|-- docker-compose.yml
```

---

## **Notes**
1. Ensure your MongoDB Atlas URI is correctly configured in each service's `app.py` file.
2. If Docker containers fail to start, verify Docker Desktop is running and retry.

---

## **Contributing**
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.


