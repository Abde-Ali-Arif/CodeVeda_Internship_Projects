(function () {
  'use strict';

  /**
   * Simple To-Do app with localStorage persistence.
   */

  const STORAGE_KEY = 'todo.tasks.v1';
  const FILTER_STORAGE_KEY = 'todo.filter.v1';

  /** @typedef {{ id: string, text: string, completed: boolean, createdAt: number }} Task */

  // DOM elements
  const form = document.getElementById('todo-form');
  const input = document.getElementById('new-todo-input');
  const list = document.getElementById('todo-list');
  const itemsLeftEl = document.getElementById('items-left');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filterButtons = Array.from(document.querySelectorAll('.filter'));

  /** @type {Task[]} */
  let tasks = [];
  /** @type {'all' | 'active' | 'completed'} */
  let currentFilter = 'all';

  function generateId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch {
      tasks = [];
    }
    try {
      const f = localStorage.getItem(FILTER_STORAGE_KEY);
      currentFilter = f === 'active' || f === 'completed' ? f : 'all';
    } catch {
      currentFilter = 'all';
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function saveFilter() {
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    tasks.unshift({ id: generateId(), text: trimmed, completed: false, createdAt: Date.now() });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
  }

  function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveTasks();
    render();
  }

  function updateTaskText(id, newText) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const trimmed = newText.trim();
    if (!trimmed) {
      deleteTask(id);
      return;
    }
    task.text = trimmed;
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    saveFilter();
    for (const btn of filterButtons) {
      const isActive = btn.dataset.filter === currentFilter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    }
    render();
  }

  function visibleTasks() {
    if (currentFilter === 'active') return tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }

  function updateItemsLeft() {
    const remaining = tasks.filter(t => !t.completed).length;
    itemsLeftEl.textContent = `${remaining} ${remaining === 1 ? 'item' : 'items'} left`;
  }

  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-item__checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Toggle task complete');

    const label = document.createElement('span');
    label.className = 'todo-item__label';
    label.textContent = task.text;
    label.title = 'Double-click to edit';

    const actions = document.createElement('div');
    actions.className = 'todo-item__actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('aria-label', 'Edit task');

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn';
    deleteBtn.type = 'button';
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(actions);

    return li;
  }

  function beginEditTask(listItem) {
    const id = listItem.dataset.id;
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const label = listItem.querySelector('.todo-item__label');
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = task.text;
    inputEl.className = 'todo-edit-input';

    const finish = (commit) => {
      inputEl.removeEventListener('blur', onBlur);
      inputEl.removeEventListener('keydown', onKeyDown);
      label.replaceWith(label); // ensure label is back
      if (commit) updateTaskText(id, inputEl.value);
      else render();
    };

    const onBlur = () => finish(true);
    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finish(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        finish(false);
      }
    };

    inputEl.addEventListener('blur', onBlur);
    inputEl.addEventListener('keydown', onKeyDown);

    label.replaceWith(inputEl);
    inputEl.focus();
    inputEl.select();
  }

  function render() {
    list.innerHTML = '';
    const items = visibleTasks();
    for (const task of items) {
      const li = createTaskElement(task);
      list.appendChild(li);
    }
    updateItemsLeft();
  }

  // Event listeners
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  list.addEventListener('click', (e) => {
    const target = e.target;
    const listItem = target.closest('.todo-item');
    if (!listItem) return;
    const id = listItem.dataset.id;

    if (target.matches('.todo-item__checkbox')) {
      toggleTask(id);
      return;
    }
    if (target.matches('.icon-btn')) {
      if (target.textContent === 'Delete') deleteTask(id);
      if (target.textContent === 'Edit') beginEditTask(listItem);
    }
  });

  list.addEventListener('dblclick', (e) => {
    const label = e.target.closest('.todo-item__label');
    if (!label) return;
    const listItem = label.closest('.todo-item');
    if (listItem) beginEditTask(listItem);
  });

  clearCompletedBtn.addEventListener('click', () => {
    clearCompleted();
  });

  for (const btn of filterButtons) {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  }

  // Initialize
  loadState();
  // Reflect stored filter in UI
  for (const btn of filterButtons) {
    const isActive = btn.dataset.filter === currentFilter;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  }
  render();
})();


