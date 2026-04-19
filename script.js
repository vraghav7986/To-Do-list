/* ----------------------------------------------------------- */
/* 1️⃣ Helper to get/​set localStorage with default values */
const LS = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : fallback;
    } catch (_) { return fallback; }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

/* ----------------------------------------------------------- */
/* 2️⃣ State variables --------------------------------------- */
let tasks = LS.get('tasks', []);
let currentFilter = LS.get('filter', 'all');      // 'all' | 'active' | 'completed'
let theme = LS.get('theme', 'light');             // 'light' | 'dark'
let dragSourceEl = null;                         // element being dragged

/* ----------------------------------------------------------- */
/* 3️⃣ DOM references ---------------------------------------- */
const tasksUl          = document.getElementById('tasks-ul');
const addTaskBtn       = document.getElementById('add-task-btn');
const clearCompletedBtn= document.getElementById('clear-completed-btn');
const themeToggleBtn   = document.getElementById('theme-toggle-btn');
const filterBtns       = document.querySelectorAll('.filter-btn');
const searchInput      = document.getElementById('search-input');
const taskModal        = document.getElementById('task-modal');
const modalTitle       = document.getElementById('modal-title');
const taskForm         = document.getElementById('task-form');
const taskIdInput      = document.getElementById('task-id');
const taskTitleInput   = document.getElementById('task-title');
const taskDescInput    = document.getElementById('task-desc');
const taskDueInput     = document.getElementById('task-due');
const taskPrioritySel  = document.getElementById('task-priority');
const cancelBtn        = document.getElementById('cancel-task-btn');

/* ----------------------------------------------------------- */
/* 4️⃣ Utility ------------------------------------------------ */
const priorityLabel = (lvl) => lvl.charAt(0).toUpperCase() + lvl.slice(1);

/* ----------------------------------------------------------- */
/* 5️⃣ Render functions -------------------------------------- */
function renderTasks() {
  // Keep only tasks that match the current filter & search
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = tasks.filter(task => {
    const matchesSearch = (
      task.title.toLowerCase().includes(searchTerm) ||
      (task.desc && task.desc.toLowerCase().includes(searchTerm))
    );

    const matchesFilter = currentFilter === 'all'
      ? true
      : currentFilter === 'active' ? !task.completed
      : task.completed;

    return matchesSearch && matchesFilter;
  });

  // Clear list
  tasksUl.innerHTML = '';

  // Re‑create <li> for each filtered task
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.id = task.id;
    li.classList.toggle('completed', task.completed);

    // MARKER: the CSS class names used below come from the stylesheet
    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';
    const titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;
    const metaEl = document.createElement('div');
    metaEl.className = 'task-meta';

    if (task.due) {
      const dueSpan = document.createElement('span');
      dueSpan.textContent = `🗓️ ${new Date(task.due).toLocaleDateString()}`;
      metaEl.appendChild(dueSpan);
    }
    const prioSpan = document.createElement('span');
    prioSpan.textContent = `⚡ ${priorityLabel(task.priority)}`;
    metaEl.appendChild(prioSpan);

    contentDiv.appendChild(titleEl);
    contentDiv.appendChild(metaEl);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';
    const editBtn = document.createElement('button');
    editBtn.title = 'Edit task';
    editBtn.innerHTML = '✏️';
    editBtn.addEventListener('click', () => openEditModal(task.id));

    const completeBtn = document.createElement('button');
    completeBtn.title = task.completed ? 'Mark as active' : 'Mark as completed';
    completeBtn.innerHTML = task.completed ? '↩️' : '✅';
    completeBtn.addEventListener('click', () => toggleTaskCompleted(task.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(completeBtn);

    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    // Drag‑and‑drop handlers
    li.addEventListener('dragstart', onDragStart);
    li.addEventListener('dragover', onDragOver);
    li.addEventListener('drop', onDrop);
    li.addEventListener('dragend', onDragEnd);

    tasksUl.appendChild(li);
  });
}

function openAddModal() {
  modalTitle.textContent = 'Add Task';
  taskIdInput.value = '';
  taskTitleInput.value = '';
  taskDescInput.value = '';
  taskDueInput.value = '';
  taskPrioritySel.value = 'medium';
  taskModal.classList.remove('hidden');
}

function openEditModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  modalTitle.textContent = 'Edit Task';
  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescInput.value = task.desc || '';
  taskDueInput.value = task.due || '';
  taskPrioritySel.value = task.priority;
  taskModal.classList.remove('hidden');
}

/* ----------------------------------------------------------- */
/* 6️⃣ Modal handlers ---------------------------------------- */
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = taskIdInput.value;
  const newTask = {
    id: id || Date.now().toString(),
    title: taskTitleInput.value.trim(),
    desc: taskDescInput.value.trim() || '',
    due: taskDueInput.value || null,
    priority: taskPrioritySel.value,
    completed: id ? tasks.find(t => t.id === id).completed : false
  };

  if (id) {            // Edit existing task
    tasks = tasks.map(t => (t.id === id ? newTask : t));
  } else {             // New task
    tasks.push(newTask);
  }

  LS.set('tasks', tasks);
  renderTasks();
  taskModal.classList.add('hidden');
});

cancelBtn.addEventListener('click', () => taskModal.classList.add('hidden'));

/* ----------------------------------------------------------- */
/* 7️⃣ Drag‑and‑drop event handlers -------------------------- */
function onDragStart(e) {
  dragSourceEl = this;
  this.classList.add('dragging');
  e.dataTransfer.setData('text/plain', this.dataset.id);
}

function onDragOver(e) {
  e.preventDefault();  // Allows drop
}

function onDrop(e) {
  e.preventDefault();
  const targetEl = this;
  const sourceId = dragSourceEl.dataset.id;
  const targetId = targetEl.dataset.id;

  // Move source to position before target
  const srcIndex = tasks.findIndex(t => t.id === sourceId);
  const tgtIndex = tasks.findIndex(t => t.id === targetId);

  if (srcIndex === -1 || tgtIndex === -1 || srcIndex === tgtIndex) return;

  // Reorder array
  const [moved] = tasks.splice(srcIndex, 1);
  tasks.splice(tgtIndex, 0, moved);
  LS.set('tasks', tasks);
  renderTasks();
}

function onDragEnd() {
  this.classList.remove('dragging');
}

/* ----------------------------------------------------------- */
/* 7️⃣ Task toggle completion --------------------------------- */
function toggleTaskCompleted(id) {
  tasks = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
  LS.set('tasks', tasks);
  renderTasks();
}

function toggleTaskCompleted(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed;
  LS.set('tasks', tasks);
  renderTasks();
}

/* ----------------------------------------------------------- */
/* 8️⃣ Toolbar event listeners ------------------------------- */
addTaskBtn.addEventListener('click', openAddModal);

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  LS.set('tasks', tasks);
  renderTasks();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;   // value stored in data-filter attr
    LS.set('filter', currentFilter);
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter));
    renderTasks();
  });
});

searchInput.addEventListener('input', renderTasks);

/* ----------------------------------------------------------- */
/* 9️⃣ Theme switch ------------------------------------------ */
document.body.classList.remove('light', 'dark');
document.body.classList.add(theme);
LS.set('theme', theme);

themeToggleBtn.addEventListener('click', () => {
  theme = theme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');
  LS.set('theme', theme);
});

/* ----------------------------------------------------------- */
/* 10️⃣ Initial render ---------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Set filter UI
  filterBtns.forEach(b => b.dataset.filter = b.dataset.filter || 'all');
  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter));

  renderTasks();
});
