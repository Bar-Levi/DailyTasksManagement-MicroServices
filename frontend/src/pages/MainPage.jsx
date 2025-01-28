import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    fetchTasks,
    addTask,
    markDone,
    deleteTask,
    editTask,
    resetTasks,
    searchTasks,
    sortTasks,
} from '../api';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import { useLocation } from 'react-router-dom';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState({ task_name: '', due_hour: '' });
    const [sorted, setSorted] = useState(false);
    const { state } = useLocation();
    const currentUsername = state?.user?.username || '';
    const fetchInProgress = useRef(false);

    const loadTasks = useCallback(async () => {
        if (fetchInProgress.current) return;
        
        try {
            fetchInProgress.current = true;
            
            if (!currentUsername) {
                console.error('Username is required to load tasks.');
                return;
            }
            
            let updatedTasks;
            if (sorted) {
                updatedTasks = await sortTasks(currentUsername);
            } else if (searchQuery.task_name || searchQuery.due_hour) {
                const { task_name, due_hour } = searchQuery;
                updatedTasks = await searchTasks(task_name, due_hour, currentUsername) || [];
            } else {
                updatedTasks = await fetchTasks(currentUsername) || [];
            }
            
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            fetchInProgress.current = false;
        }
    }, [currentUsername, searchQuery, sorted]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const handleAddTask = async (newTask) => {
        try {
            if (!currentUsername) {
                console.error('Username is required to add a task.');
                return;
            }
            await addTask({ ...newTask, username: currentUsername });
            await loadTasks();  // Direct refetch after mutation
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            await loadTasks();  // Direct refetch after mutation
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleToggleDone = async (id) => {
        try {
            const task = tasks.find((task) => task._id === id);
            await markDone(id, { is_done: !task.is_done });
            await loadTasks();  // Direct refetch after mutation
        } catch (error) {
            console.error('Error toggling task status:', error);
        }
    };

    const handleEditTask = async (id, updates) => {
        try {
            await editTask(id, updates);
            await loadTasks();  // Direct refetch after mutation
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const handleResetTasks = async () => {
        try {
            await resetTasks(currentUsername);
            setSorted(false);
            await loadTasks();  // Direct refetch after mutation
        } catch (error) {
            console.error('Error resetting tasks:', error);
        }
    };

    const handleSortTasks = async () => {
        try {
            setSearchQuery({ task_name: '', due_hour: '' });
            setSorted(true);
        } catch (error) {
            console.error('Error sorting tasks:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch('http://localhost:4010/delete_user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUsername }),
            });

            if (response.ok) {
                alert('User deleted successfully');
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    const handleMockClick = async (service) => {
        try {
            const response = await fetch(`http://localhost:${service}`, { method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                alert(data.message);
            } else {
                alert('Error fetching data');
            }
        } catch (error) {
            alert('Error fetching data');
        }
    };

    const updateSearchQuery = (key, value) => {
        setSearchQuery(prev => ({ ...prev, [key]: value }));
        setSorted(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-3xl font-bold text-center text-gray-800">Task Manager</h1>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
                    <div className="flex flex-col space-y-2 mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Search Tasks</h2>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Search by task name..."
                                value={searchQuery.task_name}
                                onChange={(e) => updateSearchQuery('task_name', e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 shadow focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                            <input
                                type="time"
                                placeholder="Search by due hour..."
                                value={searchQuery.due_hour}
                                onChange={(e) => updateSearchQuery('due_hour', e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 shadow focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            *Tasks will automatically update as you type in the search fields.
                        </p>
                    </div>
    
                    <div className="flex space-x-2 items-center">
                        <button
                            onClick={handleResetTasks}
                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                        >
                            Delete All Tasks
                        </button>
                        <button
                            onClick={handleSortTasks}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                        >
                            <span className="mr-2">Sort by Due Hour</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 3a1 1 0 00-.707 1.707l3 3a1 1 0 001.414 0l3-3A1 1 0 0015.293 3H10zM6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDeleteUser}
                            name="delete-user-button"
                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600"
                        >
                            Delete User
                        </button>
                        <button
                            onClick={async () => {
                                await handleMockClick('5002/analyze');
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Analyze Tasks
                        </button>
                        <button
                            onClick={async () => {
                                await handleMockClick('5003/share');
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Share Tasks
                        </button>
                        <button
                            onClick={async () => {
                                await handleMockClick('5004/sync');
                            }}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Sync Tasks
                        </button>
                    </div>
                </div>
                <AddTaskForm onAdd={handleAddTask} username={currentUsername} />
                <TaskList
                    tasks={tasks}
                    onDelete={handleDeleteTask}
                    onToggleDone={handleToggleDone}
                    onEdit={handleEditTask}
                />
            </div>
        </div>
    );
};

export default App;