
function createInitialReferences() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const activeTasksDiv = document.getElementById('active-tasks-div');
    const completedTasksDiv = document.getElementById('completed-tasks-div');
    const taskHistoryDiv = document.getElementById('task-history-div');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    return {
        taskInput,
        addTaskBtn,
        activeTasksDiv,
        completedTasksDiv,
        taskHistoryDiv,
        startTimeInput,
        endTimeInput
    };
}


window.onload = function() {
    const {
        taskInput,
        addTaskBtn,
        activeTasksDiv,
        completedTasksDiv,
        taskHistoryDiv,
        startTimeInput,
        endTimeInput
    } = createInitialReferences();
    displayTasks();
    addEventListeners(
        taskInput,
        addTaskBtn,
        activeTasksDiv,
        completedTasksDiv,
        taskHistoryDiv,
        startTimeInput,
        endTimeInput
    );
};

function displayTasks() {
    const {
        activeTasksDiv,
        completedTasksDiv,
        taskHistoryDiv
    } = createInitialReferences();

    activeTasksDiv.innerHTML = '';
    completedTasksDiv.innerHTML = '';
    taskHistoryDiv.innerHTML = '';

    const tasks = getTasksFromLocalStorage();
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const taskHistory = tasks.filter(task => task.completed && task.history);

    activeTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        activeTasksDiv.appendChild(taskElement);
    });

    completedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        completedTasksDiv.appendChild(taskElement);
    });

    taskHistory.forEach(task => {
        const taskElement = createTaskElement(task);
        taskHistoryDiv.appendChild(taskElement);
    });
}


function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}


function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    if (task.completed) {
        taskText.classList.add('completed');
    }
    taskText.textContent = task.value;

    const timeRange = document.createElement('div');
    timeRange.classList.add('time-range');
    if (task.startTime && task.endTime) {
        const startTime = new Date('1970-01-01T' + task.startTime + 'Z').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date('1970-01-01T' + task.endTime + 'Z').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        timeRange.innerHTML = `
            <span>${startTime}</span>
            <span>to</span>
            <span>${endTime}</span>
        `;
    }

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.textContent = task.completed ? 'Uncomplete' : 'Complete';
    completeBtn.onclick = () => completeTask(task.value);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
        const newTaskValue = prompt('Enter the new task value:', task.value);
        const newStartTime = prompt('Enter the new start time (HH:MM):', task.startTime);
        const newEndTime = prompt('Enter the new end time (HH:MM):', task.endTime);
        editTask(task.value, newTaskValue, newStartTime, newEndTime);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTask(task.value);

    buttonsDiv.appendChild(completeBtn);
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    taskElement.appendChild(taskText);
    taskElement.appendChild(timeRange);
    taskElement.appendChild(buttonsDiv);

    return taskElement;
}


function addEventListeners(
    taskInput,
    addTaskBtn,
    activeTasksDiv,
    completedTasksDiv,
    taskHistoryDiv,
    startTimeInput,
    endTimeInput
) {
    addTaskBtn.onclick = () => addTask(
        taskInput.value,
        startTimeInput.value,
        endTimeInput.value
    );
    taskInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            addTask(
                taskInput.value,
                startTimeInput.value,
                endTimeInput.value
            );
        }
    };
}


function addTask(taskValue, startTime, endTime) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({
        value: taskValue,
        completed: false,
        startTime: startTime,
        endTime: endTime,
        history: false
    });
    updateLocalStorage(tasks);
    displayTasks();
    document.getElementById('task-input').value = '';
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
}


function updateLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function completeTask(taskValue) {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        if (task.value === taskValue) {
            task.completed = !task.completed;
            if (task.completed) {
                task.history = true;
            }
        }
    });
    updateLocalStorage(tasks);
    displayTasks();
}

function editTask(taskValue, newTaskValue, newStartTime, newEndTime) {
const tasks = getTasksFromLocalStorage();
tasks.forEach((task, index) => {
if (task.value === taskValue) {
    if (newTaskValue !== null && newTaskValue.trim() !== '') {
        tasks[index].value = newTaskValue;
    }
    if (newStartTime !== null && newStartTime.trim() !== '') {
        tasks[index].startTime = newStartTime;
    }
    if (newEndTime !== null && newEndTime.trim() !== '') {
        tasks[index].endTime = newEndTime;
    }
}
});
updateLocalStorage(tasks);
displayTasks();
}

function deleteTask(taskValue) {
    const tasks = getTasksFromLocalStorage();
    const filteredTasks = tasks.filter(task => task.value !== taskValue);
    updateLocalStorage(filteredTasks);
    displayTasks();
}
