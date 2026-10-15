const API = "/api/tasks";

const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

async function loadTasks() {
    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Could not load tasks");
        }

        const tasks = await response.json();
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            const title = document.createElement("span");
            title.textContent = task.title;

            if (task.completed) {
                title.style.textDecoration = "line-through";
            }

            li.appendChild(title);

            const completeBtn = document.createElement("button");
            completeBtn.textContent = task.completed ? "Undo" : "Complete";
            completeBtn.type = "button";
            completeBtn.onclick = () => toggleTask(task);

            li.appendChild(completeBtn);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.type = "button";
            deleteBtn.onclick = () => deleteTask(task.id);

            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        taskCount.textContent = tasks.length;
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("Could not add task");
        }

        taskInput.value = "";
        await loadTasks();
    } catch (error) {
        console.error("Error adding task:", error);
        alert("Could not add task. Please try again.");
    }
});

async function toggleTask(task) {
    try {
        const response = await fetch(`${API}/${task.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        });

        if (!response.ok) {
            throw new Error("Could not update task");
        }

        await loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Could not update task.");
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Could not delete task");
        }

        await loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Could not delete task.");
    }
}

loadTasks();