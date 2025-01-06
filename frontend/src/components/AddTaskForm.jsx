import React, { useState } from 'react';

const AddTaskForm = ({ onAdd }) => {
    const [taskName, setTaskName] = useState('');
    const [dueHour, setDueHour] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ task_name: taskName, due_hour: dueHour, is_done: false });
        setTaskName('');
        setDueHour('');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-4 mt-6"
        >
            <input
                type="text"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
            />
            <input
                type="time"
                value={dueHour}
                onChange={(e) => setDueHour(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
            />
            <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
                Add Task
            </button>
        </form>
    );
};

export default AddTaskForm;
