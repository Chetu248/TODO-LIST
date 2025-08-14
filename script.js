const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
renderTodos();

addBtn.addEventListener("click", addTodo);
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return alert("Please enter a task!");

    const newTodo = { text, completed: false };
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

    const li = createTodoElement(newTodo, todos.length - 1);
    li.classList.add("new-item");
    li.addEventListener("animationend", () => li.classList.remove("new-item"));

    todoList.appendChild(li);
    todoInput.value = "";
    showSuccess("Task Added ✅");
}

function createTodoElement(todo, index) {
    const li = document.createElement("li");
    if (todo.completed) li.classList.add("completed");

    const taskText = document.createElement("span");
    taskText.textContent = todo.text;
    taskText.style.cursor = "pointer";
    taskText.addEventListener("click", () => toggleComplete(index));

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit");
    editBtn.addEventListener("click", () => startEdit(index, li, taskText));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete");
    deleteBtn.addEventListener("click", () => deleteTodo(index, li));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskText);
    li.appendChild(actions);

    return li;
}

function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveAndRender();
}

function startEdit(index, li, taskTextEl) {
    li.classList.add("editing");

    const input = document.createElement("input");
    input.type = "text";
    input.value = todos[index].text;

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.classList.add("save");
    saveBtn.addEventListener("click", () => finishEdit(index, input.value));

    li.replaceChild(input, taskTextEl);

    const actions = li.querySelector(".actions");
    actions.innerHTML = "";
    actions.appendChild(saveBtn);

    input.focus();
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") finishEdit(index, input.value);
    });
}

function finishEdit(index, newValue) {
    if (newValue.trim() === "") return alert("Task cannot be empty!");
    todos[index].text = newValue.trim();
    saveAndRender();
    showSuccess("Task Updated ✏️");
}

function deleteTodo(index, liElement) {
    liElement.classList.add("fade-out");
    liElement.addEventListener("animationend", () => {
        todos.splice(index, 1);
        saveAndRender();
        showSuccess("Task Deleted ❌");
    });
}

function saveAndRender() {
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = "";
    todos.forEach((todo, index) => {
        const li = createTodoElement(todo, index);
        todoList.appendChild(li);
    });
}

function showSuccess(message) {
    const msg = document.createElement("div");
    msg.className = "success-message";
    msg.textContent = message;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}
