// =========================================
// TASKFLOW - TO-DO APP JAVASCRIPT
// =========================================

// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const completedCount = document.getElementById("completedCount");
const totalCount = document.getElementById("totalCount");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

const emptyState = document.getElementById("emptyState");

const clearCompletedBtn = document.getElementById("clearCompleted");

const currentDate = document.getElementById("currentDate");

const filterButtons = document.querySelectorAll(".filter-btn");

// =========================================
// TASK DATA
// =========================================

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";

// =========================================
// SHOW CURRENT DATE
// =========================================

function showDate() {

const today = new Date();

const options = {
    weekday: "short",
    month: "short",
    day: "numeric"
};

currentDate.textContent = today.toLocaleDateString(
    "en-US",
    options
);

}

showDate();

// =========================================
// SAVE TASKS
// =========================================

function saveTasks() {

localStorage.setItem(
    "taskflowTasks",
    JSON.stringify(tasks)
);

}

// =========================================
// ADD TASK
// =========================================

function addTask() {

const text = taskInput.value.trim();

// Don't allow empty task
if (text === "") {

    taskInput.focus();

    return;
}


const newTask = {

    id: Date.now(),

    text: text,

    completed: false
};


tasks.unshift(newTask);

saveTasks();

taskInput.value = "";

taskInput.focus();

renderTasks();

}

// =========================================
// ENTER KEY TO ADD TASK
// =========================================

taskInput.addEventListener("keydown", function(event) {

if (event.key === "Enter") {

    addTask();
}

});

// =========================================
// ADD BUTTON
// =========================================

addTaskBtn.addEventListener("click", addTask);

// =========================================
// TOGGLE TASK
// =========================================

function toggleTask(id) {

tasks = tasks.map(function(task) {

    if (task.id === id) {

        return {
            ...task,
            completed: !task.completed
        };
    }

    return task;
});


saveTasks();

renderTasks();

}

// =========================================
// DELETE TASK
// =========================================

function deleteTask(id) {

tasks = tasks.filter(function(task) {

    return task.id !== id;
});


saveTasks();

renderTasks();

}

// =========================================
// CLEAR COMPLETED
// =========================================

clearCompletedBtn.addEventListener("click", function() {

tasks = tasks.filter(function(task) {

    return !task.completed;
});


saveTasks();

renderTasks();

});

// =========================================
// SEARCH TASKS
// =========================================

searchInput.addEventListener("input", function() {

renderTasks();

});

// =========================================
// FILTER BUTTONS
// =========================================

filterButtons.forEach(function(button) {

button.addEventListener("click", function() {

    filterButtons.forEach(function(btn) {

        btn.classList.remove("active");
    });


    button.classList.add("active");


    currentFilter =
        button.dataset.filter;


    renderTasks();
});

});

// =========================================
// GET FILTERED TASKS
// =========================================

function getFilteredTasks() {

const searchText =
    searchInput.value
        .toLowerCase()
        .trim();


let filteredTasks = tasks;


// Filter by status
if (currentFilter === "active") {

    filteredTasks =
        filteredTasks.filter(function(task) {

            return !task.completed;
        });
}


if (currentFilter === "completed") {

    filteredTasks =
        filteredTasks.filter(function(task) {

            return task.completed;
        });
}


// Filter by search
if (searchText !== "") {

    filteredTasks =
        filteredTasks.filter(function(task) {

            return task.text
                .toLowerCase()
                .includes(searchText);
        });
}


return filteredTasks;

}

// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

taskList.innerHTML = "";


const filteredTasks =
    getFilteredTasks();


// Empty state
if (filteredTasks.length === 0) {

    emptyState.style.display = "block";

} else {

    emptyState.style.display = "none";
}


// Create each task
filteredTasks.forEach(function(task) {

    const taskItem =
        document.createElement("div");


    taskItem.className =
        "task-item";


    if (task.completed) {

        taskItem.classList.add("completed");
    }


    // Checkbox
    const checkbox =
        document.createElement("div");


    checkbox.className =
        "task-checkbox";


    if (task.completed) {

        checkbox.classList.add("checked");
    }


    checkbox.addEventListener("click", function() {

        toggleTask(task.id);
    });


    // Task text
    const taskText =
        document.createElement("div");


    taskText.className =
        "task-text";


    taskText.textContent =
        task.text;


    // Delete button
    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "delete-btn";


    deleteButton.innerHTML =
        "🗑️";


    deleteButton.title =
        "Delete task";


    deleteButton.addEventListener(
        "click",
        function() {

            deleteTask(task.id);
        }
    );


    // Add elements
    taskItem.appendChild(checkbox);

    taskItem.appendChild(taskText);

    taskItem.appendChild(deleteButton);


    taskList.appendChild(taskItem);
});


updateProgress();

}

// =========================================
// UPDATE PROGRESS
// =========================================

function updateProgress() {

const total =
    tasks.length;


const completed =
    tasks.filter(function(task) {

        return task.completed;

    }).length;


totalCount.textContent =
    total;


completedCount.textContent =
    completed;


let percentage = 0;


if (total > 0) {

    percentage =
        Math.round(
            (completed / total) * 100
        );
}


progressFill.style.width =
    percentage + "%";


progressPercent.textContent =
    percentage + "%";

}

// =========================================
// INITIAL LOAD
// =========================================

renderTasks();