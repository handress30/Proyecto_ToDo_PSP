/* Como convención, usaremos variables en inglés y comentarios en español.
 * Este trabajo ha sido desarrollado por Héctor Andrés Sánchez, Franco Velasco y Diana Salazar.
 * Utilizamos el modelo PSP como modelo para asegurar la calidad del código.
 */

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  initializeChart(); // Inicializa el gráfico al cargar la página en blanco
});

document.getElementById("task-form").addEventListener("submit", addTask);

// Agregamos con esta funcion una tarea desde el formulario de entrada
function addTask(e) {
  e.preventDefault();
  const newTask = document.getElementById("new-task").value;
  if (newTask.trim() === "") return; // impedimos que se agreguen tareas vacías
  addTaskToList(newTask, false);
  storeTaskInLocalStorage(newTask, false);
  document.getElementById("new-task").value = "";
  initializeChart(); // Actualizamos el gráfico después de agregar la tarea
}

// Añadimos visualmente la tarea a la lista
function addTaskToList(task, isCompleted) {
  const taskList = document.getElementById("task-list");
  const li = document.createElement("li");
  const taskText = document.createElement("span"); // Usamos span para el texto para mejorar la grstion del DOM
  taskText.textContent = task;
  li.appendChild(taskText);
  if (isCompleted) {
    li.classList.add("completed");
  }
  li.appendChild(createDeleteButton());
  li.appendChild(createCompleteButton());
  taskList.appendChild(li);
}

// Crea mosun botón para eliminar las tareas
function createDeleteButton() {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete-btn";
  deleteBtn.onclick = removeTask;
  return deleteBtn;
}

// Creamos  un botón para marcar las  tareas como completadas
function createCompleteButton() {
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✓";
  completeBtn.className = "complete-btn";
  completeBtn.onclick = toggleTaskCompletion;
  return completeBtn;
}

// con esta funcion cambiamos  el estado de completado de la tarea y actualizamos el local storage
function toggleTaskCompletion(e) {
  const li = e.target.parentElement;
  const taskText = li.querySelector("span").textContent;
  li.classList.toggle("completed");
  updateTaskInLocalStorage(taskText, li.classList.contains("completed"));
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

// essta funcion guarda la nueva tarea en Local storage
function storeTaskInLocalStorage(task, isCompleted) {
  let tasks = getTasksFromLocalStorage();
  tasks.push({ task, isCompleted });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Por medio de esta funcion recuperamos las tareas guardadas de local storage
function getTasksFromLocalStorage() {
  let tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
}

// Por medio de esta funcion recargamos las tareas guardadas al recargar la página
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

// Actualizamos  el estado de una tarea específica en Loca Storage
function updateTaskInLocalStorage(task, isCompleted) {
  let tasks = getTasksFromLocalStorage();
  tasks = tasks.map((item) => {
    if (item.task === task) {
      return { ...item, isCompleted };
    }
    return item;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Esta funcion Inicializa el gráfico de tareas
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
