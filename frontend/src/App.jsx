import React, { useState, useEffect } from 'react';
import { fetchTasks, addTask, markDone, deleteTask, editTask, resetTasks, searchTasks, sortTasks } from './api';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState({ task_name: '', due_hour: '' });
    const [sorted, setSorted] = useState(false); // New state to track if the tasks are sorted
    const [unrender, setUnrender] = useState(false); // New state to track if the tasks are sorted

    useEffect(() => {
        const loadTasks = async () => {
            console.log('Loading tasks');
            try {
                if(unrender)
                    setUnrender(false);
                else if (sorted) {
                    setUnrender(true);
                    const sortedTasks = await sortTasks();
                    setTasks(sortedTasks);
                    console.log('Sorted');
                } else if (searchQuery.task_name || searchQuery.due_hour) {
                    setUnrender(true);
                    const { task_name, due_hour } = searchQuery;
                    const filteredTasks = await searchTasks(task_name, due_hour);
                    setTasks(filteredTasks || []);
                } else if (!sorted) {
                    setUnrender(true);
                    // Fetch only if not sorted
                    const data = await fetchTasks();
                    setTasks(data || []);
                }
            } catch (error) {
                console.error('Error loading tasks:', error);
            }
        };

        loadTasks();
    }, [tasks, searchQuery, sorted]);

    const handleAddTask = async (newTask) => {
        const addedTask = await addTask(newTask);
        setTasks([...tasks, addedTask]);
    };

    const handleDeleteTask = async (id) => {
        await deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
    };

    const handleToggleDone = async (id) => {
        const task = tasks.find(task => task._id === id);
        const updatedTask = await markDone(id, { is_done: !task.is_done });
        setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
    };

    const handleEditTask = async (id, updates) => {
        const updatedTask = await editTask(id, updates);
        setTasks(tasks.map(t => (t._id === id ? updatedTask : t)));
    };

    const handleResetTasks = async () => {
        await resetTasks();
        setTasks([]);
        setSorted(false); // Reset sorted flag
    };

    const handleSortTasks = async () => {
        try {
            setSearchQuery({ task_name: '', due_hour: '' });
            setSorted(true); // Set sorted flag
        } catch (error) {
            console.error('Error sorting tasks:', error);
        }
    };

    const updateSearchQuery = (key, value) => {
        setSearchQuery({ ...searchQuery, [key]: value });
        setSorted(false); // Reset sorted flag when a search query is updated
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
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
                    </div>
                </div>
                <AddTaskForm onAdd={handleAddTask} />
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
