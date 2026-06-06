const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");
const searchInput = document.querySelector("#searchInput");
const taskList = document.querySelector("#taskList");
const taskTemplate = document.querySelector("#taskTemplate");
const clearDoneButton = document.querySelector("#clearDoneButton");
const navFilters = document.querySelectorAll(".nav-filter");
const priorityFilters = document.querySelectorAll(".priority-filter");
const progressPercent = document.querySelector("#progressPercent");
const progressFill = document.querySelector("#progressFill");
const totalCount = document.querySelector("#totalCount");
const activeCount = document.querySelector("#activeCount");
const doneCount = document.querySelector("#doneCount");
const taskHint = document.querySelector("#taskHint");

const storageKey = "taskly-tasks";

let tasks = JSON.parse(localStorage.getItem(storageKey)) || [
  {
    id: crypto.randomUUID(),
    title: "Sketch the first Taskly layout",
    priority: "high",
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Add filters and progress tracking",
    priority: "medium",
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    title: "Push the project to GitHub",
    priority: "low",
    completed: false,
    createdAt: new Date().toISOString()
  }
];

let statusFilter = "all";
let priorityFilter = "all";
let searchTerm = "";

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function getVisibleTasks() {
  return tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !task.completed) ||
      (statusFilter === "completed" && task.completed);

    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = "";

  if (visibleTasks.length === 0) {
    taskList.innerHTML = `
      <li class="empty-state">
        <div>
          <strong>No tasks found.</strong>
          <p>Add a new task or change your filters.</p>
        </div>
      </li>
    `;
    return;
  }

  visibleTasks.forEach((task) => {
    const item = taskTemplate.content.firstElementChild.cloneNode(true);
    const completeButton = item.querySelector(".complete-button");
    const deleteButton = item.querySelector(".delete-button");
    const title = item.querySelector(".task-title");
    const date = item.querySelector(".task-date");
    const priority = item.querySelector(".priority-pill");

    item.dataset.id = task.id;
    item.classList.toggle("completed", task.completed);
    title.textContent = task.title;
