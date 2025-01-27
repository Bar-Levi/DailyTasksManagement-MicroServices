import React, { useState } from 'react';

const TaskItem = ({ task, onDelete, onToggleDone, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({
        task_name: task.task_name,
        due_hour: task.due_hour,
    });

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setEditedTask({ task_name: task.task_name, due_hour: task.due_hour });
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        console.log('edited task: ' + JSON.stringify(editedTask));
        onEdit(task._id, editedTask);
        setIsEditing(false);
    };

    return (
        <div
            data-cy={`task-item-${task._id}`} // Unique identifier for each task
            className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                task.is_done ? 'bg-green-100' : 'bg-white'
            } hover:shadow-lg transition-shadow duration-300`}
        >
            {isEditing ? (
                <div className="flex flex-col gap-2 flex-1">
                    <input
                        type="text"
                        value={editedTask.task_name}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, task_name: e.target.value })
                        }
                        data-cy="edit-task-name-input" // Cypress selector for task name input
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Task Name"
                    />
                    <input
                        type="time"
                        value={editedTask.due_hour}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, due_hour: e.target.value })
                        }
                        data-cy="edit-due-hour-input" // Cypress selector for due hour input
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            ) : (
                <div>
                    <h3
                        data-cy="task-name" // Cypress selector for task name
                        className={`text-lg font-semibold ${
                            task.is_done ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}
                    >
                        {task.task_name}
                    </h3>
                    <p
                        data-cy="task-due-hour" // Cypress selector for task due hour
                        className="text-sm text-gray-500"
                    >
                        Due: {task.due_hour}
                    </p>
                </div>
            )}
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSaveClick}
                            data-cy="save-task-button" // Cypress selector for save button
                            className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleCancelClick}
                            data-cy="cancel-edit-button" // Cypress selector for cancel button
                            className="px-4 py-2 text-sm font-medium bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-300"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleEditClick}
                            data-cy="edit-task-button" // Cypress selector for edit button
                            className="px-4 py-2 text-sm font-medium bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition duration-300"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={() => onToggleDone(task._id)}
                            data-cy={`toggle-done-button-${task.task_name.replace(' ', '-').toLowerCase()}`} // Cypress selector for toggle done button
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                task.is_done
                                    ? 'bg-gray-400 text-white hover:bg-gray-500'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            } transition duration-300`}
                        >
                            {task.is_done ? 'Undo' : 'Complete'}
                        </button>
                        <button
                            onClick={() => onDelete(task._id)}
                            data-cy={`delete-task-button-${task._id}`} // Cypress selector for delete button
                            className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskItem;
