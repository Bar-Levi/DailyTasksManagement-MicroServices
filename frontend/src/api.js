// Mock API for interacting with backend microservices

export async function addTask(task) {
    if (!task.username) {
        throw new Error("Username is required to add a task");
    }

    const response = await fetch('http://localhost:4000/add_task', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });

    if (!response.ok) {
        throw new Error(`Failed to add task: ${response.statusText}`);
    }

    return response.json();
}

export async function deleteTask(id) {
    if (!id) {
        throw new Error("Task ID is required to delete a task");
    }
    console.log('id: ' + id);
    await fetch(`http://localhost:4001/remove_task/${id}`, { method: "DELETE" });
}

export async function editTask(id, updates) {
    if (!id) {
        throw new Error("Task ID is required to edit a task");
    }

    const response = await fetch(`http://localhost:4002/edit_task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error(`Failed to edit task: ${response.statusText}`);
    }

    return response.json();
}

export async function markDone(id, updates) {
    if (!id) {
        throw new Error("Task ID is required to mark a task as done");
    }

    console.log('Mark Done: ', id, JSON.stringify(updates));
    const response = await fetch(`http://localhost:4003/mark_done/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error(`Failed to mark task as done: ${response.statusText}`);
    }

    return response.json();
}

export async function fetchTasks(username) {
    if (!username) {
        throw new Error("Username is required to fetch tasks");
    }

    try {
        // Try fetching from port 4004 with username query
        const response = await fetch(`http://localhost:4004/tasks?username=${username}`);
        if (!response.ok) throw new Error(`Error from port 4004: ${response.statusText}`);
        return await response.json();
    } catch (err) {
        console.error("Failed to fetch from port 4004");

        try {
            // Fallback to port 5000 with username query
            const response = await fetch(`http://localhost:5000/tasks?username=${username}`);
            if (!response.ok) throw new Error(`Error from port 5000: ${response.statusText}`);
            return await response.json();
        } catch (err) {
            console.error("Failed to fetch from port 5000.");
            throw new Error("Unable to fetch tasks from both ports 4004 and 5000");
        }
    }
}

// Search tasks by task_name and/or due_hour with username
export async function searchTasks(task_name, due_hour, username) {
    if (!username) {
        throw new Error("Username is required to search tasks");
    }

    const params = new URLSearchParams();
    if (task_name) params.append('task_name', task_name);
    if (due_hour) params.append('due_hour', due_hour);
    params.append('username', username); // Add username to query

    const response = await fetch(`http://localhost:4005/search_task?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to search tasks');
    return response.json();
}

// Fetch sorted tasks by due hour with username
export async function sortTasks(username) {
    if (!username) {
        throw new Error("Username is required to fetch sorted tasks");
    }

    const response = await fetch(`http://localhost:4006/sort_tasks?username=${username}`);
    if (!response.ok) throw new Error('Failed to fetch sorted tasks');
    return response.json();
}

// Reset all tasks for a specific username
export async function resetTasks(username) {
    if (!username) {
        throw new Error("Username is required to reset tasks");
    }

    try {
        // Try resetting tasks on port 4007
        const response = await fetch(`http://localhost:4007/reset_tasks`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });
        if (!response.ok) throw new Error(`Error from port 4007: ${response.statusText}`);
        return await response.json();
    } catch (err) {
        console.error("Failed to reset tasks on port 4007.");

        try {
            // Fallback to port 5001 if port 4007 fails
            const response = await fetch(`http://localhost:5001/reset_tasks`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username }),
            });
            if (!response.ok) throw new Error(`Error from port 5001: ${response.statusText}`);
            return await response.json();
        } catch (err) {
            console.error("Failed to reset tasks on port 5001.");
            throw new Error("Unable to reset tasks from both ports 4007 and 5001");
        }
    }
}
