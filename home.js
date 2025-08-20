document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const grid = document.getElementById('grid');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const resetBtn = document.getElementById('resetBtn');

    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    let editingId = null;

    renderTasks(); // Initial render

    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = form.title.value.trim();
        if (!title) return;

        const due = form.due.value;
        const color = form.color.value;

        if (editingId) {
            tasks = tasks.map(t =>
                t.id === editingId ? { ...t, title, due, color } : t
            );
            resetForm();
        } else {
            tasks.push({ id: Date.now(), title, due, color, completed: false });
        }

        saveAndRender(); // Save and re-render
    });

    cancelBtn.addEventListener('click', resetForm);
    resetBtn.addEventListener('click', () => form.reset());

    function editTask(id) {
        const t = tasks.find(x => x.id === id);
        form.title.value = t.title;
        form.due.value = t.due;
        form.color.value = t.color;
        editingId = id;
        submitBtn.textContent = 'Update Task';
        cancelBtn.hidden = false;
        form.title.focus();
    }

    function deleteTask(id) {
        if (!confirm('Delete this task?')) return;
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }

    function toggleComplete(id) {
        tasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function resetForm() {
        editingId = null;
        form.reset();
        submitBtn.textContent = 'Add Task';
        cancelBtn.hidden = true;
    }

    function renderTasks() {
        grid.innerHTML = ''; // Clear existing cards

        tasks.forEach(task => {
            const card = document.createElement('article');
            card.className = `card card--${task.color} ${task.completed ? 'card--completed' : ''}`;

            // Smooth animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'card__checkbox';
            checkbox.checked = task.completed;
            checkbox.title = 'Mark as completed';
            checkbox.addEventListener('change', () => toggleComplete(task.id));

            // Title
            const h3 = document.createElement('h3');
            h3.className = 'card__title';
            h3.textContent = task.title;

            // Due date
            const p = document.createElement('p');
            p.className = 'card__due';
            p.textContent = task.due ? `Due: ${task.due}` : '';

            // Actions
            const actions = document.createElement('div');
            actions.className = 'card__actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn--icon';
            editBtn.title = 'Edit';
            editBtn.innerHTML = '✎';
            editBtn.addEventListener('click', () => editTask(task.id));

            const delBtn = document.createElement('button');
            delBtn.className = 'btn--icon';
            delBtn.title = 'Delete';
            delBtn.innerHTML = '🗑';
            delBtn.addEventListener('click', () => deleteTask(task.id));

            actions.append(editBtn, delBtn);
            card.append(checkbox, actions, h3, p);
            grid.append(card);
        });
    }
});