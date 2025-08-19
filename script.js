const TASKS_KEY = 'todo-tasks';

function getTasks() {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

const addTaskBtn = document.querySelector('.add__task-btn');
const inputField = document.getElementById('input__field');
const tasksContainer = document.getElementById('tasksContainer');

let taskId = 1;

function loadTasksFromStorage() {
    const tasks = getTasks();

    if (tasks.length > 0) {
        taskId = Math.max(...tasks.map(t => t.id)) + 1;
    }


    tasks.forEach(taskData => {
        createTaskElement(taskData);
    });
}

function createTaskElement(taskData) {
    const { id, text, completed } = taskData;

    const newTask = document.createElement('div');
    newTask.classList.add('newTask');
    newTask.dataset.id = id;

    if (completed) {
        newTask.classList.add('completed');
    }

    newTask.innerHTML = `
    <input type="text" value="${text}" ${completed ? 'readonly' : ''}>
    <button class="btn__complete">${completed ? 'Молодец!' : 'Сделано'}</button>
    <button class="btn__delete">Удалить</button>`;

    if (completed) {
        const input = newTask.querySelector('input');
        input.style.textDecoration = "line-through";
        input.style.color = "#888";
    }

    tasksContainer.prepend(newTask);

    const completeBtn = newTask.querySelector('.btn__complete');
    const deleteBtn = newTask.querySelector('.btn__delete');
    const input = newTask.querySelector('input');

    completeBtn.addEventListener('click', () => {
        if (!completed) {
            newTask.classList.add('completed');
            input.style.textDecoration = "line-through";
            input.style.color = "#888";
            input.setAttribute('readonly', 'readonly');
            completeBtn.disabled = true;
            completeBtn.textContent = "Молодец!";
            tasksContainer.appendChild(newTask);

            const tasks = getTasks();
            const task = tasks.find(t => t.id == id);
            if (task) {
                task.completed = true;
                saveTasks(tasks);
            }
        }
    });

    deleteBtn.addEventListener('click', () => {
        newTask.style.animation = 'fadeOut 0.3s ease forwards';

        setTimeout(() => {
            tasksContainer.removeChild(newTask);
        }, 300);

        const tasks = getTasks().filter(t => t.id != id);
        saveTasks(tasks);
    });
}

function addNewTask() {
    const text = inputField.value.trim();
    if (text === "") return;

    const newTaskData = {
        id: taskId++,
        text: text,
        completed: false
    };

    const tasks = getTasks();
    tasks.push(newTaskData);
    saveTasks(tasks);

    createTaskElement(newTaskData);

    inputField.value = "";
}

const filterButtons = document.querySelectorAll('.filter-btn');

function setupFilterListeners() {
    function filterTasks(filter) {
        const tasks = document.querySelectorAll('.newTask');
        tasks.forEach(task => {
            const isCompleted = task.classList.contains('completed');

            if (filter === 'active') {
                task.style.display = isCompleted ? 'none' : 'flex';
            } else if (filter === 'completed') {
                task.style.display = isCompleted ? 'flex' : 'none';
            } else {
                task.style.display = 'flex';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            filterTasks(filter);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    setupFilterListeners();
});


addTaskBtn.addEventListener('click', addNewTask);

inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewTask();
    }
});