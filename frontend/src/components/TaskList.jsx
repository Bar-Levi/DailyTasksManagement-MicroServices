import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDelete, onToggleDone, onEdit, onAdd }) => (
    <div className="flex flex-col gap-4 mt-6">
        {tasks.length > 0 ? (
            tasks.map((task, index) => (
                <TaskItem
                    key={task._id || index} // Use _id if available, fallback to index
                    task={task}
                    onDelete={onDelete}
                    onToggleDone={onToggleDone}
                    onEdit={onEdit}
                />
            ))
        ) : (
            <p className="text-gray-500 text-center mt-10">
                No tasks found. Add your first task! 🚀
            </p>
        )}
    </div>
);

export default TaskList;
