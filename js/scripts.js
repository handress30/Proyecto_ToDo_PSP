/* Como convención, usaremos variables en inglés y comentarios en español.
 * Este trabajo ha sido desarrollado por Héctor Andrés Sánchez, Franco Velasco y Diana Salazar.
 * Utilizamos el modelo PSP como modelo para asegurar la calidad del código.
 */

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  initializeChart(); // Inicializa el gráfico al cargar la página en blanco
});

document.getElementById("task-form").addEventListener("submit", addTask);

// Agregamos con esta función una tarea desde el formulario de entrada
function addTask(e) {
  e.preventDefault();
  const newTask = document.getElementById("new-task").value;
  if (newTask.trim() === "") return; // Impedimos que se agreguen tareas vacías
  addTaskToList(newTask, false);
  storeTaskInLocalStorage(newTask, false);
  document.getElementById("new-task").value = "";
  initializeChart(); // Actualizamos el gráfico después de agregar la tarea
}

// Añadimos visualmente la tarea a la lista
function addTaskToList(task, isCompleted) {
  const taskList = document.getElementById("task-list");
  const li = document.createElement("li");
  const taskText = document.createElement("span"); // Usamos span para el texto para mejorar la gestión del DOM
  taskText.textContent = task;
  li.appendChild(taskText);
  if (isCompleted) {
    li.classList.add("completed");
  }
  li.appendChild(createDeleteButton());
  li.appendChild(createCompleteButton());
  li.appendChild(createEditButton());
  taskList.appendChild(li);
}

// Crea un botón para eliminar las tareas
function createDeleteButton() {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = removeTask;
  return deleteBtn;
}

// Creamos un botón para marcar las tareas como completadas
function createCompleteButton() {
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✓";
  completeBtn.className = "complete-btn";
  completeBtn.onclick = toggleTaskCompletion;
  return completeBtn;
}

// Crea un botón para editar las tareas
function createEditButton() {
  const editBtn = document.createElement("button");
  editBtn.textContent = "Editar";
  editBtn.className = "edit-btn";
  editBtn.onclick = editTask;
  return editBtn;
}

// Función para editar tareas
function editTask(e) {
  const li = e.target.parentElement;
  const span = li.querySelector("span");
  const input = document.createElement("input");
  input.type = "text";
  input.value = span.textContent;
  input.onblur = () => finishEdit(input, span);
  li.insertBefore(input, span);
  li.removeChild(span);
  input.focus();
}

// Finaliza la edición de una tarea
function finishEdit(input, span) {
  const li = input.parentElement;
  const oldTask = span.textContent;
  const newTask = input.value;
  span.textContent = newTask;
  li.insertBefore(span, input);
  li.removeChild(input);
  updateTaskInLocalStorage(
    oldTask,
    newTask,
    li.classList.contains("completed")
  );
}

// Cambiamos el estado de completado de la tarea y actualizamos el local storage
function toggleTaskCompletion(e) {
  const li = e.target.parentElement;
  const taskText = li.querySelector("span").textContent;
  li.classList.toggle("completed");
  updateTaskInLocalStorage(
    taskText,
    taskText,
    li.classList.contains("completed")
  );
  initializeChart(); // Actualizamos el gráfico al cambiar el estado de la tarea
}

// Eliminamos la tarea tanto visualmente como del Local storage
function removeTask(e) {
  const li = e.target.parentElement;
  const taskText = li.querySelector("span").textContent;
  removeFromLocalStorage(taskText);
  li.remove();
  initializeChart(); // Actualizamos el gráfico después de eliminar la tarea
}

// Guarda la nueva tarea en Local storage
function storeTaskInLocalStorage(task, isCompleted) {
  let tasks = getTasksFromLocalStorage();
  tasks.push({ task, isCompleted });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Recuperamos las tareas guardadas de local storage
function getTasksFromLocalStorage() {
  let tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Recargamos las tareas guardadas al recargar la página
function loadTasks() {
  const tasks = getTasksFromLocalStorage();
  tasks.forEach((item) => addTaskToList(item.task, item.isCompleted));
}

// Eliminamos una tarea específica de Local Storage
function removeFromLocalStorage(task) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.filter((item) => item.task !== task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Actualizamos el estado de una tarea específica en Local Storage
function updateTaskInLocalStorage(oldTask, newTask, isCompleted) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.map((item) => {
    if (item.task === oldTask) {
      return { ...item, task: newTask, isCompleted };
    }
    return item;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Inicializa el gráfico de tareas
function initializeChart() {
  const tasks = getTasksFromLocalStorage();
  const completedCount = tasks.filter((task) => task.isCompleted).length;
  const pendingCount = tasks.length - completedCount;
  const ctx = document.getElementById("taskChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Completadas", "Pendientes"],
      datasets: [
        {
          label: "Estado de las Tareas",
          data: [completedCount, pendingCount],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Función para ordenar tareas alfabéticamente
function sortTasks() {
  const taskList = document.getElementById("task-list");
  let tasks = Array.from(taskList.children);
  tasks.sort((a, b) => {
    const aText = a.querySelector("span").textContent.toLowerCase();
    const bText = b.querySelector("span").textContent.toLowerCase();
    return aText.localeCompare(bText);
  });
  tasks.forEach((task) => taskList.appendChild(task));
}

// Función para ordenar tareas por estado
function sortByStatus() {
  const taskList = document.getElementById("task-list");
  let tasks = Array.from(taskList.children);
  tasks.sort(
    (a, b) =>
      b.classList.contains("completed") - a.classList.contains("completed")
  );
  tasks.forEach((task) => taskList.appendChild(task));
}
