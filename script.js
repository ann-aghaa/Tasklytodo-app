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
    date.textContent = `Created ${formatDate(task.createdAt)}`;
    priority.textContent = task.priority;
    priority.classList.add(task.priority);

    completeButton.addEventListener("click", () => toggleTask(task.id));
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(item);
  });
}

function renderProgress() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const active = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  totalCount.textContent = total;
  activeCount.textContent = active;
  doneCount.textContent = done;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  taskHint.textContent =
    total === 0
      ? "Add your first task to start tracking progress."
      : `${done} of ${total} tasks completed. Saved automatically.`;
}

function render() {
  renderTasks();
  renderProgress();
  saveTasks();
}

function addTask(title, priority) {
  tasks.unshift({
    id: crypto.randomUUID(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  });
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  render();
}

function setActiveButton(buttons, clickedButton) {
  buttons.forEach((button) => button.classList.remove("active"));
  clickedButton.classList.add("active");
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();

  if (title.length === 0) {
    return;
  }

  addTask(title, priorityInput.value);
  taskInput.value = "";
  taskInput.focus();
});

navFilters.forEach((button) => {
  button.addEventListener("click", () => {
    statusFilter = button.dataset.filter;
    setActiveButton(navFilters, button);
    renderTasks();
  });
});

priorityFilters.forEach((button) => {
  button.addEventListener("click", () => {
    priorityFilter = button.dataset.priority;
    setActiveButton(priorityFilters, button);
    renderTasks();
  });
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  renderTasks();
});

clearDoneButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  render();
});

render();
