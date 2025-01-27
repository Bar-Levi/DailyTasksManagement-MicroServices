import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddTaskForm = ({ onAdd, username }) => {
    const [taskName, setTaskName] = useState('');
    const [dueHour, setDueHour] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTask = {
            task_name: taskName,
            due_hour: dueHour,
            is_done: false,
            username,
        };

        try {
            // Add the new task
            await onAdd(newTask);

            // Reset the fields
            setTaskName('');
            setDueHour('');

            // Show success alert
            Swal.fire({
                title: 'Task Added!',
                text: `${newTask.task_name} has been added successfully.`,
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Error adding task:', error);

            // Show error alert
            Swal.fire({
                title: 'Error',
                text: 'There was an issue adding the task. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
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
                name="dueHour"
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
